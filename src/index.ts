import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from "@jupyterlab/application";

import { PathExt } from "@jupyterlab/coreutils";

import { IMainMenu } from "@jupyterlab/mainmenu";

import { INotebookTracker, NotebookActions } from "@jupyterlab/notebook";

import { CommandRegistry } from '@lumino/commands';

import {
  MenuSvg,
  pythonIcon,
  terminalIcon,
  textEditorIcon,
  extensionIcon,
  folderIcon,
} from '@jupyterlab/ui-components';

import { listSnippets, Snippet, fetchSnippet } from "./snippets";

/**
 * The command IDs used by the code snippets plugin.
 */
namespace CommandIDs {
  export const open = "code-snippets:open";
}

/**
 * A tree to represent the list of snippets.
 */
type Tree = Map<string, Tree>;

/**
 * Convert the list of snippets a tree.
 * @param snippets The list of snippets.
 */
function toTree(snippets: string[][]) {
  const tree = new Map<string, Tree>();
  snippets.forEach(snippet => {
    let node = tree;
    snippet.forEach(part => {
      if (!node.has(part)) {
        node.set(part, new Map<string, Tree>());
      }
      node = node.get(part);
    })
  });
  return tree;
}

/**
 * Populate a menu from a tree of snippets.
 * @param menu to populate.
 * @param commands The command registry.
 * @param tree The tree of snippets.
 * @param path The current path in the tree.
 */
function populateMenu(menu: MenuSvg, commands: CommandRegistry , rootId: string, tree: Tree, path: string[] = []) {
  for (const [name, map] of tree.entries()) {
    const fullpath = path.concat(name);
    if (map.size === 0) {
      menu.addItem({
        command: CommandIDs.open,
        args: { label: name, snippet: { rootId, path: fullpath} }
      });
    } else {
      const submenu = new MenuSvg({ commands })
      populateMenu(submenu, commands, rootId, map, path.concat(name));
      submenu.title.label = name;
      submenu.title.icon = folderIcon;
      menu.addItem({type: 'submenu', submenu});
    }
  }
}

/**
 * Initialization data for the jupyterlab-code-snippets extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: "jupyterlab-code-snippets",
  autoStart: true,
  optional: [IMainMenu, INotebookTracker],
  activate: async (
    app: JupyterFrontEnd,
    menu: IMainMenu | null,
    notebookTracker: INotebookTracker | null
  ) => {
    const { commands } = app;

    const isEnabled = () => {
      return (
        notebookTracker?.currentWidget !== null &&
        notebookTracker?.currentWidget === app.shell.currentWidget
      );
    }

    commands.addCommand(CommandIDs.open, {
      label: args => args['label'] as string,
      icon: args => {
        const ext = PathExt.extname(args['label'] as string);
        if (ext === '.py') {
          return pythonIcon;
        }
        if (ext === '.sh') {
          return terminalIcon;
        }
        return textEditorIcon;
      },
      execute: async args => {
        const snippet = args['snippet'] as Snippet;
        const response = await fetchSnippet(snippet);
        const content = response.content;

        if (!isEnabled()) {
          return;
        }

        const current = notebookTracker.currentWidget;
        const notebook = current.content;
        NotebookActions.insertBelow(notebook);
        const activeCell = notebook.activeCell;
        activeCell.model.value.text = content;
      },
      isEnabled
    });

    if (menu) {
      const snippets = await listSnippets();
      const snippetsMenu = new MenuSvg({ commands });
      snippetsMenu.title.label = 'Code Snippets';
      menu.addMenu(snippetsMenu);

      const libraryMenu = new MenuSvg({commands});
      populateMenu(libraryMenu, commands, 'Libraries', toTree(snippets['Libraries']));
      libraryMenu.title.label = 'Libraries';
      libraryMenu.title.icon = extensionIcon;
      snippetsMenu.addItem({type: 'submenu', submenu: libraryMenu});

      snippetsMenu.addItem({type: 'separator'});

      populateMenu(snippetsMenu, commands, 'User', toTree(snippets['User']));
    }
  }
};

export default extension;

from ._version import __version__
from .handlers import setup_handlers
from .loader import SnippetsLoader


def _jupyter_server_extension_paths():
    return [{
        'module': 'jupyterlab-code-snippets'
    }]


def load_jupyter_server_extension(nb_app):
    """Registers the API handler to receive HTTP requests from the frontend extension.
    Parameters
    ----------
    nb_app: notebook.notebookapp.NotebookApp
        Notebook application instance
    """
    snippet_dir = nb_app.config.get('JupyterLabCodeSnippets', {}).get('snippet_dir', '')
    # TODO: add snippets from jupyter paths?

    loader = SnippetsLoader(snippet_dir)
    setup_handlers(nb_app.web_app, loader)

import sys
import os

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
    default_user_dir = os.path.join(os.path.expanduser("~"), 'jupyterlab_code_snippets')
    user_snippet_dir = nb_app.config.get('JupyterLabCodeSnippets', {}).get('snippet_dir', default_user_dir)

    library_snippet_dir = os.path.join(sys.prefix, 'share', 'jupyter', 'jupyterlab_code_snippets')

    loader = SnippetsLoader({
        'User': user_snippet_dir,
        'Libraries': library_snippet_dir})

    setup_handlers(nb_app.web_app, loader)

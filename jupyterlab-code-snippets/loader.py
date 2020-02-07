import os

from pathlib import PurePath


class SnippetsLoader:
    def __init__(self, snippet_dir):
        self.snippet_dir = snippet_dir

    def collect_snippets(self):
        # TODO: handle multiple directories
        root = self.snippet_dir
        snippets = []
        for dirpath, dirnames, filenames in os.walk(root):
            for f in filenames:
                fullpath = PurePath(dirpath).relative_to(root).joinpath(f)
                snippets.append(fullpath.parts)
        snippets.sort()
        return snippets

    def get_snippet_content(self, snippet):
        try:
            path = os.path.join(self.snippet_dir, *snippet)
            with open(path) as f:
                content = f.read()
        except:
            content = ''

        return content


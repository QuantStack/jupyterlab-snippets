import os

import tornado

from pathlib import PurePath


class SnippetsLoader:
    def __init__(self, roots):
        self.roots = roots

    def collect_snippets(self):
        snippets_dict = {}
        for root_id, root_path in self.roots.items():
            snippets = []
            for dirpath, dirnames, filenames in os.walk(root_path):
                for f in filenames:
                    fullpath = PurePath(dirpath).relative_to(root_path).joinpath(f)
                    snippets.append(fullpath.parts)
            snippets.sort()
            snippets_dict[root_id] = snippets

        return snippets_dict


    def get_snippet_content(self, snippet):
        try:
            root_path = self.roots[snippet['rootId']]
            path = os.path.join(root_path, *snippet['path'])

            # Prevent access to the entire file system when the path contains '..'
            accessible = os.path.realpath(path).startswith(root_path)

            exists = os.path.isfile(path)

            if accessible and exists:
                with open(path) as f:
                    content = f.read()

        except:
            raise tornado.web.HTTPError(status_code=500)

        if not accessible:
            raise tornado.web.HTTPError(status_code=403)
        if not exists:
            raise tornado.web.HTTPError(status_code=404)

        return content

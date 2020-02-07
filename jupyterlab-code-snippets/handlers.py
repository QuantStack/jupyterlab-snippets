import json

import tornado

from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join


class ListSnippets(APIHandler):
    def initialize(self, loader):
        self.loader = loader

    @tornado.web.authenticated
    @tornado.gen.coroutine
    def get(self):
        snippets = self.loader.collect_snippets()
        self.finish(json.dumps(snippets))


class GetSnippet(APIHandler):
    def initialize(self, loader):
        self.loader = loader

    @tornado.web.authenticated
    @tornado.gen.coroutine
    def post(self):
        data = self.get_json_body()
        snippet = data['snippet']
        content = self.loader.get_snippet_content(snippet)
        self.finish(json.dumps({
            "content": content
        }))


def setup_handlers(web_app, loader):
    base_url = web_app.settings['base_url']
    handlers = [
        (url_path_join(base_url, 'snippets', 'list'), ListSnippets, {'loader': loader}),
        (url_path_join(base_url, 'snippets', 'get'), GetSnippet, {'loader': loader})
    ]
    web_app.add_handlers('.*$', handlers)

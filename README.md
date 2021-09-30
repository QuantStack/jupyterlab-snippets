# jupyterlab-snippets

![Github Actions Status](https://github.com/QuantStack/jupyterlab-snippets/workflows/Build/badge.svg)
[![Version](https://img.shields.io/pypi/v/jupyterlab-snippets.svg)](https://pypi.python.org/project/jupyterlab-snippets)
[![Conda Version](https://img.shields.io/conda/vn/conda-forge/jupyterlab-snippets.svg)](https://anaconda.org/conda-forge/jupyterlab-snippets)
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/QuantStack/jupyterlab-snippets/stable?urlpath=lab/tree/binder/example.ipynb)

Snippets Extension for JupyterLab.

This extension is composed of a Python package named `jupyterlab-snippets`
for the server extension and a NPM package named `jupyterlab-snippets`
for the frontend extension.

## Requirements

- JupyterLab >= 2.0
- Node.js

## Install

Using conda:

```
conda install -c conda-forge jupyterlab-snippets
```

Using pip:

```bash
pip install jupyterlab-snippets
```

If you use JupyterLab 2.x, you will have to rebuild JupyterLab with:

```bash
jupyter lab build
```

## Usage

Add snippets in `[jupyter_data_dir]/snippets` (see: https://jupyter.readthedocs.io/en/latest/projects/jupyter-directories.html#id2)

To find the Jupyter data directory, run:
```bash
$ jupyter --path
```
This will for example show the following list on macOS:
```
config:
    /Users/<username>/.jupyter
    ...
data:
    /Users/<username>/Library/Jupyter
    /Users/<username>/miniconda3/envs/<envname>/share/jupyter
    ...
runtime:
    ...
```

Use the first directory listed under `data:` to add files to, these become snippets in the menu. Each file contains one
snippet. Directories can be used to organize the snippet files and will become submenu's in the menu.

In JupyterLab, use the "Snippets" menu to select the snippet:

<img width="570" alt="Schermafbeelding 2020-03-30 om 17 25 31" src="https://user-images.githubusercontent.com/46192475/77930697-8257fd00-72ab-11ea-8a77-36f45d6442d9.png">

## Convert snippets from jupyter-boilerplate format

See [jupyter-boilerplate-converter](jupyter-boilerplate-converter/README.md) on how to convert snippets from the
[jupyter-boilerplate](https://github.com/moble/jupyter_boilerplate) classic notebook extension (not available for
JupyterLab) to jupyterlab-snippets.

## Troubleshoot

If you are seeing the frontend extension but it is not working, check
that the server extension is enabled:

```bash
jupyter serverextension list
```

If the server extension is installed and enabled but you are not seeing
the frontend, check the frontend extension is installed and enabled:

```bash
jupyter labextension list
```

If it is installed, try:

```bash
jupyter lab clean
jupyter lab build
```

## Development Install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterlab-snippets directory
# Install package in development mode
pip install -e .
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm run build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm run watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm run build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Uninstall

```bash
pip uninstall jupyterlab-snippets
```

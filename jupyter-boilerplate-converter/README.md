# jupyter-boilerplate-converter

Convert snippets from the [jupyter-boilerplate](https://github.com/moble/jupyter_boilerplate) classic notebook
extension (not available for JupyterLab) to [jupyterlab-snippets](../README.md).

## Usage

Run the following commands in the `jupyter-boilerplate-converter` directory.
```
$ npm install
$ npm run convert <path/to/boilerplate-snippet.js> <path/to/snippets/dir> [extension]
```

## Example

Convert built-in jupyter-boilerplate snippets.

Run the following commands in the `jupyter-boilerplate-converter` directory.

Download jupyter-boilerplate from github and list snippets:
```
$ git clone git://github.com/moble/jupyter_boilerplate
$ ls -l jupyter_boilerplate/snippets_submenus_python

astropy.js           matplotlib.js        numpy.js             numpy_ufuncs.js      python.js
scipy.js             scipy_special.js     sympy_assumptions.js h5py.js              numba.js
numpy_polynomial.js  pandas.js            python_regex.js      scipy_constants.js   sympy.js
sympy_functions.js
```

Find JupyterLab data directories:
```
$ jupyter --paths

# Output in MacOs, this will be different on Linux and Windows
...
data:
    /Users/<username>/Library/Jupyter
    /Users/<username>/miniconda3/envs/<envname>/share/jupyter
    /usr/local/share/jupyter
    /usr/local/share/jupyter
    /usr/share/jupyter
...
```

Convert one of the snippets to JupyterLab user-data directory (top directory in the list above):
```
$ npm install    #  only required to run once
$ npm run convert jupyter_boilerplate/snippets_submenus_python/numpy.js ~/Library/Jupyter .py
```

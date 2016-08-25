#!/usr/bin/env python

import json
from helper import load_pca_json

from flask import Flask, render_template


app = Flask(__name__, static_url_path='/MEPmosaic/static', static_folder='static')


@app.route("/MEPmosaic")
def index():
    return render_template("index.html")


# @app.route("/MEPmosaic/pca")
@app.route("/MEPmosaic/pca/<tag_name>", methods=['GET'])
def view_pca(tag_name):
    try:
        [ePCA_json, lPCA_json] = load_pca_json(tag_name)
    except:
        print "ERROR: could not load pca json"
    return render_template("pca.html",
                           tag=tag_name,
                           ecm_pca=ePCA_json,
                           lig_pca=lPCA_json)


@app.route("/MEPmosaic/clustergram/<tag_name>", methods=['GET'])
def view_clustergram(tag_name):
    return render_template("clustergram.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)


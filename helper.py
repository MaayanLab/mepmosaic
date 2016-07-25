
import json
import yaml 

def load_pca_json(tag_name):

	path = 'static/data/pca/'+tag_name

	# ecm_json = json.load(open(path+'_ePCA.json'))
	# lig_json = json.load(open(path+'_lPCA.json'))

	ecm_json = yaml.safe_load(open(path+'_ePCA.json'))
	lig_json = yaml.safe_load(open(path+'_lPCA.json'))

	return ecm_json, lig_json

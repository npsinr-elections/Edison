from bottle import Bottle,route,request,run,get,static_file    # Importing Bottle
import json

app = Bottle()

@app.route('/')
def home():
	return open("templates/index.html").read()

@app.get('/candidates')
def candidate():
	return open("templates/candidates.html").read()

@app.post('/updateserver')
def updateserver():
	with open('candidates.json', 'w') as outfile:
		json.dump(request.json, outfile)

@app.get("/getcandidates")
def getcandidates():
	with open("candidates.json") as json_file:
		json_data = json.load(json_file)
	return json_data

@app.get('/static/css/<filename>')
def returncss(filename):
	return static_file(filename, root='static/css')

@app.get('/static/js/<filename>')
def returnjs(filename):
	return static_file(filename, root='static/js')

@app.get('/static/fonts/<filename>')
def returnfonts(filename):
	return static_file(filename, root='static/fonts')

@app.get('/static/images/<filename>')
def returnimages(filename):
	return static_file(filename, root='static/images')

run(app, host='localhost', port=8080)
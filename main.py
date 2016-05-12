from bottle import Bottle,route,request,run,get,static_file,post    # Importing Bottle
import json,os

app = Bottle()

@app.route('/')
def home():
	error_paths = []
	file_paths = ["templates","templates/index.html","templates/candidates.html","templates/poll.html","static","static/js","static/css","static/css/bootstrap.min.css","static/css/jumbotron-narrow.css","static/css/pollStyle.css","static/js/bootstrap.min.js","static/js/poll.js","candidates.json","candidateimages","candidateimages/default.gif"]
	for paths in file_paths:
		if os.path.exists(paths):
			print paths + " .................OK"
		else:
			print paths + ".................. NOT FOUND"
			error_paths.append(paths)
	print "---------------------------"
	if len(error_paths) != 0:
		print "SOME FILES DO NOT EXIST OR WEREN'T FOUND:"
		for paths in error_paths:
			print paths
	else:
		print "ALL FILES WERE FOUND. YOU ARE GOOD TO GO!"
	print "---------------------------"
	return open("templates/index.html").read()

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

@app.get('/candidateimages/<filename>')
def returncimages(filename):
	return static_file(filename, root='candidateimages')

@app.get('/candidates')
def candidate():
	return open("templates/candidates.html").read()

@app.get('/elections')
def elections():
    return open("templates/poll.html").read()

@app.post('/uploadimage')
def uploadimage():
	image = request.files.get("file")
	name, ext = os.path.splitext(image.filename)
	if ext not in ('.png','.jpg','.jpeg','.gif'):
		return 'File extension not allowed.'
	save_path = "candidateimages"
	image.save(save_path, overwrite = True)
	return "/candidateimages/" + str(image.filename)

run(app, host='localhost', port=8080)
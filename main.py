from bottle import Bottle, route, request, run, get, static_file, post    # Importing Bottle
import json,os

data = {}
instruction = {}

app = Bottle()

@app.route('/')
def home():
	error_paths = []
	file_paths = ["templates","templates/index.html","templates/candidates.html","templates/poll.html","static","static/js","static/css","static/css/bootstrap.min.css","static/css/jumbotron-narrow.css","static/css/pollStyle.css","static/js/bootstrap.min.js","static/js/poll.js","candidatesOld.json","candidateimages","candidateimages/default.gif"]
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
	with open('candidatesOld.json', 'w') as outfile:
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

@app.get('/candidates2')
def candidate():
	return open("templates/candidatesOld.html").read()

@app.get('/elections')
def elections():
	return open("templates/elections.html").read()

@app.post('/uploadimage')
def uploadimage():
	image = request.files.get("file")
	name, ext = os.path.splitext(image.filename)
	if ext not in ('.png','.jpg','.jpeg','.gif'):
		return 'File extension not allowed.'
	save_path = "candidateimages"
	image.save(save_path, overwrite = True)
	return "/candidateimages/" + str(image.filename)


@app.post('/candidateAction')
def candidateAction():
	instruction = request.json
	
	with open('candidates.json', 'r') as data_file:
		action = instruction['action']
		pollIndex = instruction['pollIndex']
		candidateIndex = instruction['candidateIndex']
		
		try:
			update = instruction['update']
			value = instruction['value']
		except KeyError:
			pass
		
		data = json.load(data_file)
		
		if action == 'delete':
			del data['values'][pollIndex]['candidates'][candidateIndex]
				
		elif action == 'update':
			data['values'][pollIndex]['candidates'][candidateIndex][update] = value
		
	with open('candidates.json', 'w') as data_file:
		data_file.write(json.dumps(data))

@app.post('/pollAction')
def pollAction():
	instruction = request.json
	
	with open('candidates.json', 'r') as data_file:
		action = instruction['action']
		pollIndex = instruction['pollIndex']
		
		try:
			value = instruction['value']
			update = instruction['update']
		except KeyError:
			pass
		
		data = json.load(data_file)
		
		if action == 'createCandidate':
			data['values'][pollIndex]['candidates'].append(value)
			
		elif action == 'update':
			data['values'][pollIndex][target] = value
			
		elif action == 'delete':
			del data['values'][pollIndex]
	
	with open('candidates.json', 'w') as data_file:
		data_file.write(json.dumps(data))

@app.post('/exit')
def exit():
	data = {}
	
	with open('candidates.json', 'r') as data_file:
		data = json.load(data_file)
		candidateIndex = 0
		
	for pollIndex in range(len(data['values'])):
		while candidateIndex < len(data['values'][pollIndex]['candidates']):
			if data['values'][pollIndex]['candidates'][candidateIndex]['name'] == '':
				del data['values'][pollIndex]['candidates'][candidateIndex]
			candidateIndex += 1
	
	with open('candidates.json', 'w') as data_file:
		data_file.write(json.dumps(data))


run(app, host='localhost', port=8080)
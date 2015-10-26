from flask import Flask,render_template,request       # Importing Flask
import json

app = Flask(__name__)		# initializing flask app

@app.route('/')
def home():
	return render_template("index.html")
@app.route('/candidates',methods=['GET','POST'])
def candidate():
	if request.method == 'GET':
		jsondata = open("candidates.json").read()
		return jsondata


if __name__ == '__main__':
    app.run(debug=True)
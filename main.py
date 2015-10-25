from flask import Flask       # Importing Flask
from flask import render_template

app = Flask(__name__)		# initializing flask app

@app.route('/')
def home():
	return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)
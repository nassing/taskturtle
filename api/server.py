"""Python Flask WebApp Auth0 integration example
"""

import json
from os import environ as env
from urllib.parse import quote_plus, urlencode

from authlib.integrations.flask_client import OAuth
from dotenv import find_dotenv, load_dotenv
from flask import Flask, redirect, render_template, session, url_for, request, jsonify

from flask_cors import CORS

import sqlite3

from utilsdb import *

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

app = Flask(__name__)

CORS(app)

app.secret_key = "d912e4303bd96c542d0ed89510d0b790e59ab30929da915710e802c424e65f97"


oauth = OAuth(app)

oauth.register(
    "auth0",
    client_id="cUPJqGCR1xcv7eiC4hQ4j8itnCN3Gh6a",
    client_secret="knyOvxSSOoM2YiV_ZOXmrmnb4KK7cPfR2W6154YMJVS9Qt3D2YoddBMRX5oznTDN",
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'https://dev-a81ploq10be8yz2n.eu.auth0.com/.well-known/openid-configuration',
)


# Controllers API
@app.route("/")
def home():
    return render_template(
        "home.html",
        session=session.get("user"),
        pretty=json.dumps(session.get("user"), indent=4),
    )


@app.route("/callback", methods=["GET", "POST"])
def callback():
    token = oauth.auth0.authorize_access_token()
    session["user"] = token
    return redirect("/")


@app.route("/login")
def login():
    return oauth.auth0.authorize_redirect(
        redirect_uri=url_for("callback", _external=True)
    )


@app.route("/logout")
def logout():
    session.clear()
    return redirect(
        "https://"
        + "dev-a81ploq10be8yz2n.eu.auth0.com"
        + "/v2/logout?"
        + urlencode(
            {
                "returnTo": url_for("home", _external=True),
                "client_id": "cUPJqGCR1xcv7eiC4hQ4j8itnCN3Gh6a",
            },
            quote_via=quote_plus,
        )
    )


@app.route("/submitTask", methods=["POST"])
def submitTask():
    username = request.json.get('username')
    taskTitle = request.json.get('taskTitle')
    taskDescription = request.json.get('taskDescription')
    taskLocation = request.json.get('taskLocation')
    taskReward = int(request.json.get('taskReward'))
    try:
        with sqlite3.connect('database.db') as conn:
            cur = conn.cursor()
            cur.execute("SELECT id FROM users WHERE username=?", (username,))
            try:
                author_id = cur.fetchone()[0]
                cur.execute("INSERT INTO tasks(title, description, reward, location, author_id) VALUES (?, ?, ?, ?, ?)", (taskTitle, taskDescription, taskReward, taskLocation, author_id))
                conn.commit()
                return ""
            except Exception as e:
                return e
    except Exception as e:
        return e
    
@app.route("/getTasks", methods=["GET"])
def getTasks():
    return jsonify(getUncompletedTasks())

@app.route("/guestRegister", methods=["POST"])
def guestRegister():
    token = request.json.get('token')
    username = "guest" + token
    try:
        with sqlite3.connect('database.db') as conn:
            cur = conn.cursor()
            cur.execute("INSERT INTO users (username, guest_token) VALUES (?, ?)", (username, token))
            conn.commit()
            return ""
    except:
        return "Error"
    
@app.route("/getUser", methods=["POST"])
def getUser():
    token = request.json.get('token')
    try:
        with sqlite3.connect('database.db') as conn:
            cur = conn.cursor()
            cur.execute("SELECT username, balance FROM users WHERE guest_token=?", (token,))
            try:
                username, balance = cur.fetchone()
            except:
                return jsonify({"error" : "User not found"})
        return jsonify({"username" : username, "balance" : balance})
    except Exception as e:
        return jsonify({"error" : "getUser, " + str(e)})
    
@app.route("/giveMoney", methods=["POST"])
def giveMoney():
    username = request.json.get('username')
    try:
        with sqlite3.connect('database.db') as conn:
            cur = conn.cursor()
            cur.execute("UPDATE users SET balance = balance + ? WHERE username=?", (100, username))
            conn.commit()
            cur.execute("SELECT balance FROM users WHERE username=?", (username,))
            balance = cur.fetchone()[0]
            return jsonify({"balance" : balance})
    except Exception as e:
        return jsonify({"error" : "giveMoney, " + str(e)})
    
@app.route("/completeTask", methods=["POST"])
def completeTask():
    task_id = request.json.get('task_id')
    helper_username = request.json.get('helper_username')
    completeTaskDB(task_id, helper_username)
    return ""


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=env.get("PORT", 4859))

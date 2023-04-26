"""Python Flask WebApp Auth0 integration example
"""

import json
from os import environ as env
from urllib.parse import quote_plus, urlencode

from authlib.integrations.flask_client import OAuth
from dotenv import find_dotenv, load_dotenv
from flask import Flask, redirect, render_template, session, url_for

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

app = Flask(__name__)
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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=env.get("PORT", 3000))

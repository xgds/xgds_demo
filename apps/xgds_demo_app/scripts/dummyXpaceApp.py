from flask import Flask, request
import json
app = Flask(__name__)

@app.route("/verifyxpace", methods=['POST', 'GET'])
def verifyXpace():
    if request.method == "POST":
        if request.is_json:
            planInfo = request.json
            print "Got", len(planInfo), "plans."
            for p in planInfo:
                planName = p["name"]
                plan = p["jsonPlan"]
                print "   Name:", planName
                print "   Site: %s (%s)" % (plan["site"]["name"], plan["site"]["bbox"])
            return "OK"
        else:
            print "No JSON submitted."
            return "NO_JSON_BODY"
    else:
        return "I only do useful stuff with a POST"

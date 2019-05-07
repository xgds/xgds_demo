from flask import Flask, request
import json
app = Flask(__name__)

@app.route("/verifyxpace", methods=['POST', 'GET'])
def verifyXpace():
    if request.method == "POST":
        print request.data
        print "\n"
        print request.headers
        if request.is_json:
            planList = request.json
            print "Got", len(planList), "plans."
            for plan in planList:
                planName = plan["name"]
                print "   Name:", planName
                print "   Site: %s (%s)" % (plan["site"]["name"], plan["site"]["bbox"])
            return "OK"
        else:
            print "No JSON submitted."
            return "NO_JSON_BODY"
    else:
        return "I only do useful stuff with a POST"

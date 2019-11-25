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


@app.route("/plansavenotify", methods=['POST', 'GET'])
def planSaveNotify():
    if request.method == "POST":
        print request.data
        print "\n"
        print request.headers
        if request.is_json:
            notifyEvent = request.json
            print "Got save notify"
            print "Notify flag:", notifyEvent["userNotification"]
            print "Plan name and id: %s(%s)" % (notifyEvent["planName"], notifyEvent["planId"])
            print "Event type:", notifyEvent["eventType"]
            print "Event timestamp:", notifyEvent["eventTimestamp"]
            print "Plan content:\n", notifyEvent["planContent"]
            print "\nPlan KML:\n", notifyEvent["planKml"]
            
            return "OK"
        else:
            print "No JSON submitted."
            return "NO_JSON_BODY"
    else:
        return "I only do useful stuff with a POST"
    

@app.route("/layersavenotify", methods=['POST', 'GET'])
def mapLayerSaveNotify():
    if request.method == "POST":
        print request.data
        print "\n"
        print request.headers
        if request.is_json:
            notifyEvent = request.json
            print "Got Map Layer save notify"
            print "Notify flag:", notifyEvent["userNotification"]
            print "Layer name and id: %s(%s)" % (notifyEvent["layerName"], notifyEvent["mapLayerId"])
            print "Event type:", notifyEvent["eventType"]
            print "Event timestamp:", notifyEvent["eventTimestamp"]

            layerKml = notifyEvent["layerKml"]
            layerJson = notifyEvent["layerJson"]
            open("/home/xgds/layerKml.kml","w").write(layerKml)
            json.dump(layerJson,open("/home/xgds/layerJson.json","w"))
            
            return "OK"
        else:
            print "No JSON submitted."
            return "NO_JSON_BODY"
    else:
        return "I only do useful stuff with a POST"
    

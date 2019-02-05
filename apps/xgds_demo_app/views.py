#__BEGIN_LICENSE__
# Copyright (c) 2015, United States Government, as represented by the
# Administrator of the National Aeronautics and Space Administration.
# All rights reserved.
#
# The xGDS platform is licensed under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# http://www.apache.org/licenses/LICENSE-2.0.
#
# Unless required by applicable law or agreed to in writing, software distributed
# under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
# CONDITIONS OF ANY KIND, either express or implied. See the License for the
# specific language governing permissions and limitations under the License.
#__END_LICENSE__

import json
import traceback
from django.http import JsonResponse
from django.conf import settings
from geocamUtil.loader import LazyGetModelByName
import requests

def computeAerEstimate(request, planPk):
    print "Calling AER for plan:", planPk

    """ Call AER over http and either return the modified plan with success message,
    or return error message.
    """
    PLAN_MODEL = LazyGetModelByName(settings.XGDS_PLANNER_PLAN_MODEL)
    response = {}
    try:
        plan = PLAN_MODEL.get().objects.get(pk=planPk)
        print "Processing plan %s at %s" % (plan.jsonPlan["name"], plan.jsonPlan["site"]["name"])
        response["plan"]= plan.jsonPlan
        headers = {"replyurl": "%s/xgds_planner2/rest/plan/save/%s" % (settings.AER_CALLBACK_HOST_AND_PORT, planPk),
                   "replyid": planPk}
        resp = requests.post("%s/processplan" % settings.AER_SERVICE_URL_BASE,
                             data=json.dumps(plan.jsonPlan), headers=headers)
        response["plan"]= plan.jsonPlan
        response["msg"]= "AER status: " + resp.text + ". \n Click 'Reload' to view updated plan"
        response["status"] = resp.status_code
        status = 200
    except Exception, e:
        traceback.print_exc()
        response["msg"] = str(e)
        response["status"] = False
        status = 406

    return JsonResponse(response, status=status)

//__BEGIN_LICENSE__
// Copyright (c) 2015, United States Government, as represented by the
// Administrator of the National Aeronautics and Space Administration.
// All rights reserved.
//
// The xGDS platform is licensed under the Apache License, Version 2.0
// (the "License"); you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0.
//
// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.
//__END_LICENSE__

app.views = app.views || {};

app.views.PlanLinksView = Marionette.View.extend({
    template: '#template-plan-links',
    onAttach: function() {
    	var callback = app.options.XGDS_PLANNER_LINKS_LOADED_CALLBACK;
        if (!_.isEmpty(callback) && callback !== "null") {
        	$.executeFunctionByName(callback, window, [this.$el]);
        }
        this.hookButtons();
    },
    templateContext: function() {
    	var planUuid = '';
    	var planId = '';
    	if (app.currentPlan !== undefined){
    		planUuid = app.currentPlan.get('uuid');
    		planId = app.currentPlan.get('serverId');
    	}
    	var data = {
    	planLinks: app.planLinks,
    	planNamedURLs: app.planNamedURLs,
    	planUuid: planUuid,
    	planId: planId,
    	}
    	return data;
    },
    hookButtons: function() {
        var context = this;
        this.$el.find('#aerButton').click(function(event) {
            event.preventDefault();
	    console.log("Running AER on plan: " + app.currentPlan.get('serverId'));
            $('#aerMessage').text('Running AER resource estimation, stand by...');
            $.ajax(
            	        {
            	            url: "/xgds_demo_app/aer/" + app.currentPlan.get('serverId'),
            	            type: "GET",
            	            timeout: 200000,
            	            success: function(data)
            	            {
            	            	$('#aerMessage').text(data.msg + " (" + data.status + ")");
//            	            	app.updatePlan(data.plan);
            	            },
            	            error: function(data)
            	            {
            	            	$('#aerMessage').text("AER Error!");
//            	            	$('#aerMessage').text(data.responseJSON.msg);
//            	            	app.updatePlan(data.responseJSON.plan);
            	            }
            	        });
        });
    }
});

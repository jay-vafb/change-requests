<template>
  <q-page class="q-pa-md q-gutter-md" style="max-width: 1000px">
    <div class="row">
      <div class="col-12 col-md-6">
        <q-input
          outlined
          label="Subject"
          stack-label
          readonly
          v-model="subject"
        />
      </div>
      <div class="col-12 col-md-4 offset-md-1">
        <q-input outlined label="Date" stack-label readonly v-model="date" />
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-2">
        <q-input
          outlined
          label="Tracking number"
          stack-label
          readonly
          v-model="trackingNumber"
        />
      </div>
      <div class="col-12 col-md-3 offset-md-1">
        <q-input
          outlined
          label="IS Requestor"
          stack-label
          readonly
          v-model="requestorName"
        />
      </div>
      <div class="col-12 col-md-4 offset-md-1">
        <q-input
          outlined
          label="Change date"
          stack-label
          readonly
          v-model="changeDate"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-3">
        <q-input
          outlined
          label="Processing"
          stack-label
          readonly
          v-model="processingSpeed"
        />
      </div>
      <div class="col-12 col-md-3 offset-md-1">
        <q-input
          outlined
          label="Risk"
          stack-label
          readonly
          v-model="riskSeverity"
        />
      </div>
      <div class="col-12 col-md-3 offset-md-1">
        <q-input
          outlined
          label="Impact"
          stack-label
          readonly
          v-model="impactSeverity"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-11">
        <q-input
          filled
          autogrow
          clearable
          type="textarea"
          label="Description of change"
          stack-label
          readonly
          v-model="description"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-11">
        <q-input
          filled
          autogrow
          clearable
          type="textarea"
          label="Testing details"
          stack-label
          readonly
          v-model="testingDetails"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-11">
        <q-input
          filled
          autogrow
          clearable
          type="textarea"
          label="Backout/Recovery plan"
          stack-label
          readonly
          v-model="recoveryPlan"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-4">
        <q-input
          outlined
          label="Approving manager"
          stack-label
          readonly
          v-model="approvingManager"
        />
      </div>
    </div>

    <div style="width: 400px">
      <q-btn
        class="q-mr-md"
        label="Approve"
        color="accent"
        style="width: 30%"
      />
      <q-btn
        class="q-mr-md"
        label="Deny"
        color="secondary"
        style="width: 30%"
      />
    </div>
  </q-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { supabase } from "../supabase";
import { logText } from "../logger";
import { useRoute } from "vue-router";

export default {
  name: "ViewChangeRequestPage",

  setup() {
    const route = useRoute();

    const subject = ref(null);
    const date = ref(null);
    const trackingNumber = ref(null);
    const requestorName = ref(null);
    const changeDate = ref(null);
    const processingSpeed = ref(null);
    const riskSeverity = ref(null);
    const impactSeverity = ref(null);
    const description = ref(null);
    const testingDetails = ref(null);
    const recoveryPlan = ref(null);
    const approvingManager = ref(null);

    onMounted(() => {
      getChangeRequest(route.params.id);
    });

    async function getChangeRequest(id) {
      try {
        const { data, error } = await supabase
          .from("change_requests")
          .select()
          .match({ id });

        if (error) throw error;
        populateFormFields(data[0]);
      } catch (error) {
        logText(error.message);
      }
    }

    function populateFormFields(changeRequest) {
      logText(changeRequest);
      subject.value = changeRequest.subject;
      date.value = changeRequest.request_date;
      trackingNumber.value = changeRequest.tracking_number;
      requestorName.value = changeRequest.requestor;
      changeDate.value = changeRequest.change_date;
      processingSpeed.value = changeRequest.processing_speed;
      riskSeverity.value = changeRequest.risk_severity;
      impactSeverity.value = changeRequest.impact_severity;
      description.value = changeRequest.description;
      testingDetails.value = changeRequest.testing_details;
      recoveryPlan.value = changeRequest.recovery_plan;
      approvingManager.value = changeRequest.approving_manager;
    }

    return {
      subject,
      date,
      trackingNumber,
      requestorName,
      changeDate,
      processingSpeed,
      riskSeverity,
      impactSeverity,
      description,
      testingDetails,
      recoveryPlan,
      approvingManager,
    };
  },
};
</script>

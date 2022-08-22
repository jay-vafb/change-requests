<template>
  <div class="q-pa-md" style="max-width: 1000px">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <div class="row">
        <div class="col-12 col-md-6">
          <q-input
            outlined
            v-model="subject"
            label="Subject"
            hint="Subject"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
        </div>
        <div class="col-12 col-md-4 offset-md-1">
          <q-input
            v-model="date"
            filled
            type="date"
            hint="Date"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please make a selection',
            ]"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-2">
          <q-input
            outlined
            v-model="trackingNumber"
            label="Tracking number"
            hint="Tracking number"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
        </div>
        <div class="col-12 col-md-3 offset-md-1">
          <q-select
            outlined
            v-model="requestor"
            :options="requestorOptions"
            label="IS requestor"
            hint="Requestor's name"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please make a selection',
            ]"
          />
        </div>
        <div class="col-12 col-md-4 offset-md-1">
          <q-input
            v-model="changeDate"
            filled
            type="date"
            hint="Proposed change date"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please make a selection',
            ]"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-3">
          <q-select
            outlined
            v-model="processingSpeed"
            :options="processingOptions"
            label="Processing"
            hint="Desired form processing speed"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please make a selection',
            ]"
          />
        </div>
        <div class="col-12 col-md-3 offset-md-1">
          <q-select
            outlined
            v-model="riskSeverity"
            :options="riskAndImpactOptions"
            label="Risk"
            hint="Risk severity"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please make a selection',
            ]"
          />
        </div>
        <div class="col-12 col-md-3 offset-md-1">
          <q-select
            outlined
            v-model="impactSeverity"
            :options="riskAndImpactOptions"
            label="Impact"
            hint="Impact severity"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please make a selection',
            ]"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-11">
          <q-input
            v-model="changeDescription"
            filled
            autogrow
            clearable
            type="textarea"
            label="Description of change"
            hint="Briefly describe the change request"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-11">
          <q-input
            v-model="testingDetails"
            filled
            autogrow
            clearable
            type="textarea"
            label="Testing details"
            hint="Briefly describe the testing procedure"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-11">
          <q-input
            v-model="recoveryPlan"
            filled
            autogrow
            clearable
            type="textarea"
            label="Backout/Recovery plan"
            hint="Briefly describe the recovery plan"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-4">
          <q-select
            outlined
            v-model="approvingManager"
            :options="approvingManagerOptions"
            label="Approving manager"
            hint="The manager who should view this request"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please make a selection',
            ]"
          />
        </div>
      </div>

      <div>
        <q-btn
          class="q-mr-md"
          type="submit"
          label="Submit"
          color="primary"
        ></q-btn>
        <q-btn
          class="q-mr-md"
          type="reset"
          label="Reset"
          color="secondary"
        ></q-btn>

        <q-spinner-oval v-if="loading" color="secondary" size="2em" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { supabase } from "../supabase";
import { logText } from "../logger";

export default {
  name: "ChangeRequestFormPage",
  setup() {
    const $q = useQuasar();

    const subject = ref(null);
    const date = ref(null);
    const trackingNumber = ref(null);
    const requestor = ref(null);
    const changeDate = ref(null);
    const processingSpeed = ref("Normal");
    const riskSeverity = ref("Low");
    const impactSeverity = ref("Low");
    const changeDescription = ref(null);
    const testingDetails = ref(null);
    const recoveryPlan = ref(null);
    const approvingManager = ref(null);
    const loading = ref(false);

    function onSubmit() {
      saveChangeRequest();
    }

    function onReset() {
      subject.value = null;
      date.value = null;
      trackingNumber.value = null;
      requestor.value = null;
      changeDate.value = null;
      processingSpeed.value = "Normal";
      riskSeverity.value = "Low";
      impactSeverity.value = "Low";
      changeDescription.value = null;
      testingDetails.value = null;
      recoveryPlan.value = null;
      approvingManager.value = null;
    }

    async function saveChangeRequest() {
      try {
        setLoading(true);
        const changeRequestData = createChangeRequest();

        const { error } = await supabase
          .from("change_requests")
          .insert(changeRequestData, {
            returning: "minimal",
          });

        if (error) throw error;
        showSuccessMessage();
      } catch (error) {
        logText(error.message);
      } finally {
        setLoading(false);
      }
    }

    function setLoading(isLoading) {
      loading.value = isLoading;
    }

    function createChangeRequest() {
      return {
        subject: subject.value,
        request_date: new Date(date.value),
        tracking_number: trackingNumber.value,
        requestor: requestor.value,
        change_date: new Date(changeDate.value),
        processing_speed: processingSpeed.value,
        risk_severity: riskSeverity.value,
        impact_severity: impactSeverity.value,
        description: changeDescription.value,
        testing_details: testingDetails.value,
        recovery_plan: recoveryPlan.value,
        approving_manager: approvingManager.value,
        status: "Under Review",
      };
    }

    function showSuccessMessage() {
      $q.notify({
        color: "green-4",
        textColor: "white",
        icon: "cloud_done",
        message: "Change request created",
      });
    }

    return {
      subject,
      date,
      trackingNumber,
      requestor,
      changeDate,
      processingSpeed,
      riskSeverity,
      impactSeverity,
      changeDescription,
      testingDetails,
      recoveryPlan,
      approvingManager,
      loading,

      requestorOptions: ["Chad Nelson", "Sripal Adamala", "Jay Call"],
      processingOptions: [
        "Normal",
        "Urgent",
        "Emergency",
        "Pre-Approved by CCB",
      ],
      riskAndImpactOptions: ["High", "Medium", "Low"],
      approvingManagerOptions: ["Karen Clarke", "Neil Gill"],

      onSubmit,
      onReset,
    };
  },
};
</script>

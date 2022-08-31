<template>
  <div class="q-pa-md" style="max-width: 1000px">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <div class="row">
        <div class="col-12 col-md-6">
          <q-input
            outlined
            v-model="subjectInput"
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
            v-model="datePicker"
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
            v-model="trackingNumberInput"
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
            v-model="requestorDropdown"
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
            v-model="changeDatePicker"
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
            v-model="processingSpeedDropdown"
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
            v-model="riskSeverityDropdown"
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
            v-model="impactSeverityDropdown"
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
            v-model="changeDescriptionInput"
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
            v-model="testingDetailsInput"
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
            v-model="recoveryPlanInput"
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
            v-model="approvingManagerDropdown"
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

        <q-spinner-oval v-if="isLoading" color="secondary" size="2em" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { supabase } from "../supabase";
import { logText, showSuccessMessage } from "src/Logger";
import emailjs from "@emailjs/browser";

export default {
  name: "ChangeRequestFormPage",
  setup() {
    const $q = useQuasar();

    const subjectInput = ref(null);
    const datePicker = ref(null);
    const trackingNumberInput = ref(null);
    const requestorDropdown = ref(null);
    const changeDatePicker = ref(null);
    const processingSpeedDropdown = ref("Normal");
    const riskSeverityDropdown = ref("Low");
    const impactSeverityDropdown = ref("Low");
    const changeDescriptionInput = ref(null);
    const testingDetailsInput = ref(null);
    const recoveryPlanInput = ref(null);
    const approvingManagerDropdown = ref(null);
    const isLoading = ref(false);

    function onSubmit() {
      saveChangeRequest();
    }

    function onReset() {
      subjectInput.value = null;
      datePicker.value = null;
      trackingNumberInput.value = null;
      requestorDropdown.value = null;
      changeDatePicker.value = null;
      processingSpeedDropdown.value = "Normal";
      riskSeverityDropdown.value = "Low";
      impactSeverityDropdown.value = "Low";
      changeDescriptionInput.value = null;
      testingDetailsInput.value = null;
      recoveryPlanInput.value = null;
      approvingManagerDropdown.value = null;
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

        sendEmailToReviewer();
        if (error) throw error;
        showSuccessMessage("Change request created", $q);
      } catch (error) {
        logText(error.message);
      } finally {
        setLoading(false);
      }
    }

    function sendEmailToReviewer() {}

    function setLoading(loading) {
      isLoading.value = loading;
    }

    function createChangeRequest() {
      return {
        subject: subjectInput.value,
        request_date: new Date(datePicker.value),
        tracking_number: trackingNumberInput.value,
        requestor: requestorDropdown.value,
        change_date: new Date(changeDatePicker.value),
        processing_speed: processingSpeedDropdown.value,
        risk_severity: riskSeverityDropdown.value,
        impact_severity: impactSeverityDropdown.value,
        description: changeDescriptionInput.value,
        testing_details: testingDetailsInput.value,
        recovery_plan: recoveryPlanInput.value,
        approving_manager: approvingManagerDropdown.value,
        status: "Under review",
      };
    }

    return {
      subjectInput,
      datePicker,
      trackingNumberInput,
      requestorDropdown,
      changeDatePicker,
      processingSpeedDropdown,
      riskSeverityDropdown,
      impactSeverityDropdown,
      changeDescriptionInput,
      testingDetailsInput,
      recoveryPlanInput,
      approvingManagerDropdown,
      isLoading,

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

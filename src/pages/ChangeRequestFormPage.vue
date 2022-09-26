<template>
  <div class="q-pa-md" style="max-width: 1000px">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <div class="row">
        <div class="col-12 col-md-6">
          <q-input
            class="q-mb-sm"
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
            class="q-mb-sm"
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
          <q-input
            class="q-mb-sm"
            outlined
            v-model="requestorName"
            label="IS requestor"
            hint="Requestor's name"
            :readonly="isVafbEmail"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
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
            class="q-mb-sm"
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
            class="q-mb-sm"
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
          <q-editor
            v-model="changeDescriptionInput"
            placeholder="Description of change"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-11">
          <q-editor
            v-model="testingDetailsInput"
            placeholder="Testing details"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-11">
          <q-editor
            v-model="recoveryPlanInput"
            placeholder="Backout/Recovery plan"
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

      <div style="width: 300px">
        <q-btn
          class="q-mr-md"
          type="submit"
          label="Submit"
          color="primary"
          style="width: 40%"
        ></q-btn>
        <q-btn
          class="q-mr-md"
          type="reset"
          label="Reset"
          color="secondary"
          style="width: 40%"
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
import { store } from "src/store";
import { logText, showSuccessMessage } from "../logger";
import axios from "axios";

export default {
  name: "ChangeRequestFormPage",
  setup() {
    const $q = useQuasar();
    const user = store.user;

    const subjectInput = ref(null);
    const datePicker = ref(null);
    const trackingNumberInput = ref(null);
    const requestorName = ref(null);
    const changeDatePicker = ref(null);
    const processingSpeedDropdown = ref("Normal");
    const riskSeverityDropdown = ref("Low");
    const impactSeverityDropdown = ref("Low");
    const changeDescriptionInput = ref("");
    const testingDetailsInput = ref("");
    const recoveryPlanInput = ref("");
    const approvingManagerDropdown = ref(null);
    const isLoading = ref(false);
    const isVafbEmail = ref(true);

    setRequestorName();

    function setRequestorName() {
      const parsed_email = user.email.split("@");

      if (parsed_email[1] !== "vafb.com") {
        isVafbEmail.value = false;
        return;
      }

      // capitalizes name properly
      const fullName = parsed_email[0];
      requestorName.value = makeTitleCase(fullName);
    }

    function makeTitleCase(fullName) {
      return fullName
        .split(".")
        .join(" ")
        .toLowerCase()
        .split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    }

    function onSubmit() {
      saveChangeRequest();
    }

    function onReset() {
      subjectInput.value = null;
      datePicker.value = null;
      trackingNumberInput.value = null;
      requestorName.value = null;
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

        const { data, error } = await supabase
          .from("change_requests")
          .insert(changeRequestData);

        // TODO: uncomment when Sendgrid account and subscription are chosen
        // sendEmailToReviewer(data[0].id);
        if (error) throw error;
        showSuccessMessage("Change request created", $q);
      } catch (error) {
        logText(error.message);
      } finally {
        setLoading(false);
      }
    }

    function createChangeRequest() {
      return {
        subject: subjectInput.value,
        request_date: new Date(datePicker.value),
        tracking_number: trackingNumberInput.value,
        requestor: makeTitleCase(requestorName.value),
        requestor_email: user.email,
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

    async function sendEmailToReviewer(changeRequestId) {
      const details = {
        trackingNumber: trackingNumberInput.value,
        status: "Under review",
        requestorName: requestorName.value,
        approvingManager: approvingManagerDropdown.value,
        changeDate: changeDatePicker.value,
        processingSpeed: processingSpeedDropdown.value,
        riskSeverity: riskSeverityDropdown.value,
        impactSeverity: impactSeverityDropdown.value,
      };

      axios
        .post(
          `https://test-email-server1.herokuapp.com/email/create/${changeRequestId}`,
          details
        )
        .then((result) => {
          logText("Message sent");
        })
        .catch((error) => {
          logText(error);
        });
    }

    function setLoading(loading) {
      isLoading.value = loading;
    }

    return {
      subjectInput,
      datePicker,
      trackingNumberInput,
      requestorName,
      changeDatePicker,
      processingSpeedDropdown,
      riskSeverityDropdown,
      impactSeverityDropdown,
      changeDescriptionInput,
      testingDetailsInput,
      recoveryPlanInput,
      approvingManagerDropdown,
      isLoading,
      isVafbEmail,

      processingOptions: [
        "Normal",
        "Urgent",
        "Emergency",
        "Pre-Approved by CCB",
      ],
      riskAndImpactOptions: ["High", "Medium", "Low"],
      approvingManagerOptions: [
        "Neil Gill",
        "Karen Clarke",
        "Theresa Richardson",
        "Teresa Custalow",
      ],

      onSubmit,
      onReset,
    };
  },
};
</script>

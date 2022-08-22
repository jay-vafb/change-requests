<template>
  <div class="q-pa-md" style="max-width: 1000px">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <div class="row">
        <div class="col-12 col-md-6">
          <q-input
            outlined
            class="form-input"
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
            class="form-input"
            filled
            type="date"
            hint="Date"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-2">
          <q-input
            outlined
            class="form-input"
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
            class="form-input"
            v-model="requestor"
            :options="requestorOptions"
            label="Requestor"
            hint="Your name"
          />
        </div>
        <div class="col-12 col-md-4 offset-md-1">
          <q-input
            class="form-input"
            v-model="changeDate"
            filled
            type="date"
            hint="Proposed change date"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-3">
          <q-select
            outlined
            class="form-input"
            v-model="processingRate"
            :options="processingOptions"
            label="Processing"
            hint="Desired form processing speed"
          />
        </div>
        <div class="col-12 col-md-3 offset-md-1">
          <q-select
            outlined
            class="form-input"
            v-model="riskSeverity"
            :options="riskAndImpactOptions"
            label="Risk"
            hint="Risk severity"
          />
        </div>
        <div class="col-12 col-md-3 offset-md-1">
          <q-select
            outlined
            class="form-input"
            v-model="impactSeverity"
            :options="riskAndImpactOptions"
            label="Impact"
            hint="Impact severity"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-11">
          <q-input
            class="form-input"
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
            class="form-input"
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
            class="form-input"
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
            class="form-input"
            v-model="approvingManager"
            :options="approvingManagerOptions"
            label="Approving manager"
            hint="The manager who should view this request"
          />
        </div>
      </div>

      <div class="row">
        <q-btn type="submit" label="Submit" color="primary"></q-btn>
      </div>
    </q-form>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";

export default {
  name: "PageName",
  setup() {
    const $q = useQuasar();

    const subject = ref(null);
    const date = ref(null);
    const trackingNumber = ref(null);
    const requestor = ref(null);
    const changeDate = ref(null);
    const processingRate = ref(null);
    const riskSeverity = ref(null);
    const impactSeverity = ref(null);
    const changeDescription = ref(null);
    const testingDetails = ref(null);
    const recoveryPlan = ref(null);
    const approvingManager = ref(null);

    return {
      subject,
      date,
      trackingNumber,
      requestor,
      changeDate,
      processingRate,
      riskSeverity,
      impactSeverity,
      changeDescription,
      testingDetails,
      recoveryPlan,
      approvingManager,

      requestorOptions: ["Chad Nelson", "Sripal Adamala", "Jay Call"],
      processingOptions: [
        "Normal",
        "Urgent",
        "Emergency",
        "Pre-Approved by CCB",
      ],
      riskAndImpactOptions: ["High", "Medium", "Low"],
      approvingManagerOptions: ["Karen Clarke", "Neil Gill"],

      onSubmit() {},

      onReset() {
        subject.value = null;
        date.value = null;
        trackingNumber.value = null;
        requestor.value = null;
        changeDate.value = null;
        processingRate.value = null;
      },
    };
  },
};
</script>

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
      <div class="col-12 col-md-3">
        <q-input
          outlined
          label="Approving manager"
          stack-label
          readonly
          v-model="approvingManager"
        />
      </div>

      <div class="col-12 col-md-4 offset-md-1">
        <q-input
          outlined
          label="Status"
          stack-label
          readonly
          v-model="status"
        />
      </div>

      <div class="col-12 col-md-2 offset-md-1">
        <q-input
          outlined
          label="Approval date"
          stack-label
          readonly
          v-model="approvalDate"
        />
      </div>
    </div>

    <br />

    <div class="row">
      <div class="col-12 col-md-11">
        <q-input
          filled
          autogrow
          type="textarea"
          label="General comments"
          stack-label
          v-model="generalComments"
        >
          <template v-slot:append>
            <q-btn
              v-if="isApprovingManager || isReviewer || isBoardApprover"
              label="Update"
              color="accent"
              @click="updateGeneralComments()"
            />
          </template>
        </q-input>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-11">
        <q-input
          filled
          autogrow
          type="textarea"
          label="Board comments"
          stack-label
          v-model="boardComments"
        >
          <template v-slot:append>
            <div class="text-caption" v-text="boardDate"></div>
          </template>
        </q-input>
      </div>
    </div>

    <div class="row">
      <q-btn
        v-if="isBoardApprover"
        label="Update"
        color="accent"
        @click="updateBoardComments()"
      />
    </div>

    <br />

    <div v-if="isChangeRequestActive" style="width: 400px">
      <q-btn
        class="q-mr-md"
        label="Approve"
        color="accent"
        style="width: 30%"
        @click="approveChangeRequest()"
      />
      <q-btn
        class="q-mr-md"
        label="Deny"
        color="secondary"
        style="width: 30%"
        @click="denyChangeRequest()"
      />
    </div>
  </q-page>
</template>

<script>
import { onBeforeMount, ref } from "vue";
import { supabase } from "../supabase";
import { logText, showErrorMessage, showSuccessMessage } from "../logger";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";

export default {
  name: "ViewChangeRequestPage",

  setup() {
    const $q = useQuasar();
    const user = supabase.auth.user();
    const route = useRoute();

    const isApprovingManager = ref(false);
    const isReviewer = ref(false);
    const isBoardApprover = ref(false);
    const isChangeRequestActive = ref(false);

    const changeRequest = ref(null);
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
    const status = ref(null);
    const approvalDate = ref(null);
    const generalComments = ref(null);
    const boardComments = ref(null);
    const boardDate = ref(null);

    onBeforeMount(() => {
      setUserRole();
      getChangeRequest(route.params.id);
    });

    async function setUserRole() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("user_role")
          .match({ id: user.id });

        if (error) throw error;

        if (data[0].user_role === "approving_manager") {
          isApprovingManager.value = true;
        } else if (data[0].user_role === "reviewer") {
          isReviewer.value = true;
        } else if (data[0].user_role === "board_approver") {
          isBoardApprover.value = true;
        }
      } catch (error) {
        logText(error.message);
      }
    }

    async function getChangeRequest(id) {
      try {
        const { data, error } = await supabase
          .from("change_requests")
          .select()
          .match({ id });

        if (data.length > 0) {
          changeRequest.value = data[0];
          setChangeRequestActive(data[0].status);
          populateFormFields();
        }

        if (error) throw error;
      } catch (error) {
        logText(error.message);
      }
    }

    function setChangeRequestActive(status) {
      if (
        isApprovedOrDenied(status) ||
        isPendingManagerApproval(status) ||
        isPendingBoardApproval(status)
      ) {
        isChangeRequestActive.value = false;
      } else {
        isChangeRequestActive.value = true;
      }
    }

    function isApprovedOrDenied(status) {
      return (
        status === "Board approved" ||
        status === "Board denied" ||
        status === "Approved" ||
        status === "Denied"
      );
    }

    function isPendingManagerApproval(status) {
      return (
        status === "Pending approval" &&
        (isReviewer.value || isBoardApprover.value)
      );
    }

    function isPendingBoardApproval(status) {
      return (
        status === "Pending board approval" &&
        (isApprovingManager.value || isReviewer.value)
      );
    }

    function populateFormFields() {
      subject.value = changeRequest.value.subject;
      date.value = changeRequest.value.request_date;
      trackingNumber.value = changeRequest.value.tracking_number;
      requestorName.value = changeRequest.value.requestor;
      changeDate.value = changeRequest.value.change_date;
      processingSpeed.value = changeRequest.value.processing_speed;
      riskSeverity.value = changeRequest.value.risk_severity;
      impactSeverity.value = changeRequest.value.impact_severity;
      description.value = changeRequest.value.description;
      testingDetails.value = changeRequest.value.testing_details;
      recoveryPlan.value = changeRequest.value.recovery_plan;
      approvingManager.value = changeRequest.value.approving_manager;
      status.value = changeRequest.value.status;
      approvalDate.value = changeRequest.value.approval_date;
      generalComments.value = changeRequest.value.general_comments;
      boardComments.value = changeRequest.value.board_recommendations;
      boardDate.value = changeRequest.value.board_date;
    }

    async function updateGeneralComments() {
      try {
        const { error } = await supabase
          .from("change_requests")
          .update({ general_comments: generalComments.value })
          .match({ id: changeRequest.value.id });

        if (error) throw error;
        showSuccessMessage("Comment updated", $q);
      } catch (error) {
        logText(error.message);
      }
    }

    async function updateBoardComments() {
      const today = new Date();

      try {
        const { error } = await supabase
          .from("change_requests")
          .update({
            board_recommendations: boardComments.value,
            board_date: today,
          })
          .match({ id: changeRequest.value.id });

        boardDate.value = formatDate(today);

        if (error) throw error;
        showSuccessMessage("Recommendations updated", $q);
      } catch (error) {
        logText(error.message);
      }
    }

    function approveChangeRequest() {
      if (
        isApprovingManager.value &&
        changeRequest.value.status === "Pending approval"
      ) {
        updateChangeRequestApprovalDate();
        if (requiresBoardApproval()) {
          updateChangeRequestStatus("Pending board approval");
        } else {
          isChangeRequestActive.value = false;
          updateChangeRequestStatus("Approved");
        }
      } else if (
        isReviewer.value &&
        (changeRequest.value.status === "Under review" ||
          changeRequest.value.status === "Needs changes")
      ) {
        isChangeRequestActive.value = false;
        updateChangeRequestStatus("Pending approval");
      } else if (
        isBoardApprover.value &&
        changeRequest.value.status === "Pending board approval"
      ) {
        isChangeRequestActive.value = false;
        updateChangeRequestStatus("Board approved");
      } else {
        showErrorMessage("You don't have the permissions to do this", $q);
      }
    }

    function denyChangeRequest() {
      if (
        isApprovingManager.value &&
        changeRequest.value.status === "Pending approval"
      ) {
        isChangeRequestActive.value = false;
        updateChangeRequestStatus("Denied");
      } else if (
        isReviewer.value &&
        changeRequest.value.status === "Under review"
      ) {
        updateChangeRequestStatus("Needs changes");
      } else if (
        isBoardApprover.value &&
        changeRequest.value.status === "Pending board approval"
      ) {
        isChangeRequestActive.value = false;
        updateChangeRequestStatus("Board denied");
      } else {
        showErrorMessage("You don't have the permissions to do this", $q);
      }
    }

    function requiresBoardApproval() {
      return (
        changeRequest.value.processing_speed !== "Normal" ||
        changeRequest.value.risk_severity !== "Low" ||
        changeRequest.value.impact_severity !== "Low"
      );
    }

    async function updateChangeRequestApprovalDate() {
      const today = new Date();
      try {
        const { error } = await supabase
          .from("change_requests")
          .update({ approval_date: today })
          .match({ id: changeRequest.value.id });

        approvalDate.value = formatDate(today);
        if (error) throw error;
      } catch (error) {
        logText(error.message);
      }
    }

    function formatDate(date) {
      return (
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getDate()).slice(-2)
      );
    }

    async function updateChangeRequestStatus(newStatus) {
      try {
        const { error } = await supabase
          .from("change_requests")
          .update({ status: newStatus })
          .match({ id: changeRequest.value.id });

        status.value = newStatus;
        changeRequest.value.status = newStatus;
        if (error) throw error;
        showSuccessMessage("Change request updated", $q);
      } catch (error) {
        logText(error.message);
      }
    }

    return {
      isReviewer,
      isApprovingManager,
      isBoardApprover,
      isChangeRequestActive,
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
      status,
      approvalDate,
      generalComments,
      boardComments,
      boardDate,

      updateGeneralComments,
      updateBoardComments,
      approveChangeRequest,
      denyChangeRequest,
    };
  },
};
</script>

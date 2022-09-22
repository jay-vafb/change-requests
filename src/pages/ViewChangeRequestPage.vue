<template>
  <q-page class="q-pa-md q-gutter-md" style="max-width: 1000px">
    <div class="row">
      <div class="col-12 col-md-6 q-mb-sm">
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
      <div class="col-12 col-md-2 q-mb-sm">
        <q-input
          outlined
          label="Tracking number"
          stack-label
          readonly
          v-model="trackingNumber"
        />
      </div>
      <div class="col-12 col-md-3 offset-md-1 q-mb-sm">
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
      <div class="col-12 col-md-3 q-mb-sm">
        <q-input
          outlined
          label="Processing"
          stack-label
          readonly
          v-model="processingSpeed"
        />
      </div>
      <div class="col-12 col-md-3 offset-md-1 q-mb-sm">
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
      <div class="col-12 col-md-3 q-mb-sm">
        <q-input
          outlined
          label="Approving manager"
          stack-label
          readonly
          v-model="approvingManager"
        />
      </div>

      <div class="col-12 col-md-4 offset-md-1 q-mb-sm">
        <q-input
          outlined
          label="Status"
          stack-label
          readonly
          v-model="status"
        />
      </div>

      <div class="col-12 col-md-2 offset-md-1 q-mb-sm">
        <q-input
          outlined
          label="Approval date"
          stack-label
          readonly
          v-model="approvalDate"
        />
      </div>
    </div>

    <div class="print-break"></div>

    <div class="row">
      <div class="col-12 col-md-11">
        <h6>Description</h6>
        <div
          class="text-body-1"
          v-html="description"
          style="width: 100%; overflow-wrap: break-word; white-space: pre-wrap"
        ></div>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-11">
        <h6>Testing details</h6>
        <div
          class="text-body-1"
          v-html="testingDetails"
          style="width: 100%; overflow-wrap: break-word; white-space: pre-wrap"
        ></div>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-11">
        <h6>Recovery plan</h6>
        <div
          class="text-body-1"
          v-html="recoveryPlan"
          style="width: 100%; overflow-wrap: break-word; white-space: pre-wrap"
        ></div>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-11">
        <div class="row">
          <h6>Board information</h6>
        </div>

        <q-select
          v-if="isBoardApprover"
          class="print-hide q-mb-sm"
          name="board"
          v-model="boardAttendeesInput"
          multiple
          :options="boardAttendeesOptions"
          color="primary"
          filled
          clearable
          label="Board attendees"
          stack-label
        />

        <q-btn
          v-if="isBoardApprover"
          class="print-hide q-mb-md"
          label="Update"
          color="accent"
          @click="updateBoardAttendees()"
        />

        <q-input
          v-if="isBoardApprover"
          filled
          autogrow
          type="textarea"
          label="Board comments"
          stack-label
          v-model="boardCommentsInput"
          class="print-hide q-mb-sm"
        />

        <q-btn
          v-if="isBoardApprover"
          class="print-hide q-mb-sm"
          label="Update"
          color="accent"
          @click="updateBoardComments()"
        />

        <div
          class="text-body-1 q-mb-md"
          v-text="'Board date: ' + (boardDate ? boardDate : '')"
        ></div>
        <div
          class="text-body-1 q-mb-md"
          style="overflow-wrap: break-word; white-space: pre-wrap"
          v-text="'Board attendees:\n' + (boardAttendees ? boardAttendees : '')"
        ></div>
        <div
          class="text-body-1"
          v-text="'Board comments:\n' + (boardComments ? boardComments : '')"
          style="width: 100%; overflow-wrap: break-word; white-space: pre-wrap"
        ></div>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-11">
        <h6>General comments</h6>
        <q-input
          filled
          autogrow
          type="textarea"
          label="Comment"
          stack-label
          v-model="generalCommentsInput"
          class="print-hide"
        >
          <template v-slot:append>
            <q-btn
              label="Create"
              color="accent"
              @click="createGeneralComment()"
            />
          </template>
        </q-input>
      </div>
    </div>

    <Comment
      v-for="item in generalComments.value"
      :key="item.id"
      :author="item.commenter"
      :createdAt="item.created_at"
      :body="item.body"
    />

    <div class="print-hide">
      <div v-if="isChangeRequestActive" class="row">
        <div class="col-12 col-md-2 q-mb-sm q-pr-sm">
          <q-btn
            label="Approve"
            color="accent"
            style="width: 100%"
            @click="approveChangeRequest()"
          />
        </div>
        <div class="col-12 col-md-2 q-mb-sm q-pr-sm">
          <q-btn
            label="Deny"
            color="secondary"
            style="width: 100%"
            @click="denyChangeRequest()"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-4 q-pr-sm">
          <q-btn
            label="Print"
            color="primary"
            style="width: 100%"
            @click="printChangeRequest()"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive } from "vue";
import { supabase } from "../supabase";
import { logText, showErrorMessage, showSuccessMessage } from "../logger";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { store } from "src/store";
import axios from "axios";
import Comment from "src/components/Comment.vue";

export default {
  name: "ViewChangeRequestPage",
  setup() {
    const $q = useQuasar();
    const user = store.user;
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
    const generalCommentsInput = ref(null);
    const generalComments = reactive({});
    const boardAttendeesInput = ref(null);
    const boardCommentsInput = ref(null);
    const boardAttendees = ref(null);
    const boardComments = ref(null);
    const boardDate = ref(null);
    const boardAttendeesOptions = [
      "Karen Clarke",
      "Neil Gill",
      "Kyle Shover",
      "Theresa Richardson",
    ];
    setUserRole()
      .then((_) => {
        getChangeRequest(route.params.id);
        getChangeRequestComments(route.params.id);
      })
      .catch((error) => {
        logText(error);
      });
    async function setUserRole() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("user_role")
          .match({ username: user.email });
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
          await setChangeRequestActive(data[0].status);
          populateFormFields();
        }
        if (error) throw error;
      } catch (error) {
        logText(error.message);
      }
    }
    async function setChangeRequestActive(status) {
      if (
        isApprovedOrDenied(status) ||
        isPendingManagerApproval(status) ||
        isPendingBoardApproval(status) ||
        isUnderReview(status)
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
    function isUnderReview(status) {
      return (
        (status === "Under review" || status === "Needs changes") &&
        (isApprovingManager.value || isBoardApprover.value)
      );
    }
    async function getChangeRequestComments(id) {
      try {
        const { data, error } = await supabase
          .from("comments")
          .select()
          .match({ change_request_id: id });
        if (data.length > 0) {
          generalComments.value = data;
        }
        if (error) throw error;
      } catch (error) {
        logText(error.message);
      }
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
      boardAttendees.value = changeRequest.value.board_attendees;
      boardComments.value = changeRequest.value.board_recommendations;
      boardDate.value = changeRequest.value.board_date;
    }
    async function createGeneralComment() {
      if (!generalCommentsInput.value) return;
      try {
        const { error } = await supabase
          .from("comments")
          .insert(getCommentData(false), {
            returning: "minimal",
          });
        if (error) throw error;
        if (!commentsExist()) {
          generalComments.value = new Array(getCommentData(true));
        } else {
          generalComments.value.push(getCommentData(true));
        }
        generalCommentsInput.value = "";
        sendCommentEmail();
        showSuccessMessage("Comment created", $q);
      } catch (error) {
        logText(error.message);
      }
    }
    function getCommentData(dateFormatted) {
      const today = new Date();
      return {
        change_request_id: changeRequest.value.id,
        created_at: dateFormatted ? formatDate(today) : today,
        commenter: user.email,
        body: generalCommentsInput.value,
      };
    }
    function commentsExist() {
      return generalComments.value ? true : false;
    }
    // TODO: get and pass in original requestor name
    function sendCommentEmail() {
      axios
        .post(
          `https://test-email-server1.herokuapp.com/email/comment/${changeRequest.value.id}`
        )
        .then((result) => {
          logText("Message sent");
        })
        .catch((error) => {
          logText(error);
        });
    }
    async function updateBoardAttendees() {
      const formattedBoardAttendees = formatBoardAttendees();
      try {
        const { error } = await supabase
          .from("change_requests")
          .update({ board_attendees: formattedBoardAttendees })
          .match({ id: changeRequest.value.id });
        boardAttendees.value = formattedBoardAttendees;
        if (error) throw error;
        boardAttendeesInput.value = null;
        showSuccessMessage("Board attendees updated", $q);
      } catch (error) {
        logText(error.message);
      }
    }
    function formatBoardAttendees() {
      return JSON.stringify(boardAttendeesInput.value)
        .replaceAll("[", "")
        .replaceAll("]", "")
        .replaceAll('"', "")
        .replaceAll(",", "\n");
    }
    async function updateBoardComments() {
      try {
        const { error } = await supabase
          .from("change_requests")
          .update({
            board_recommendations: boardCommentsInput.value,
          })
          .match({ id: changeRequest.value.id });
        boardComments.value = boardCommentsInput.value;
        if (error) throw error;
        boardCommentsInput.value = "";
        sendCommentEmail();
        showSuccessMessage("Board comments updated", $q);
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
          sendStatusChangeEmail("Pending board approval");
          updateChangeRequestStatus("Pending board approval");
        } else {
          sendStatusChangeEmail("Approved");
          updateChangeRequestStatus("Approved");
        }
        isChangeRequestActive.value = false;
      } else if (
        isReviewer.value &&
        (changeRequest.value.status === "Under review" ||
          changeRequest.value.status === "Needs changes")
      ) {
        isChangeRequestActive.value = false;
        sendStatusChangeEmail("Pending approval");
        updateChangeRequestStatus("Pending approval");
      } else if (
        isBoardApprover.value &&
        changeRequest.value.status === "Pending board approval"
      ) {
        updateChangeRequestBoardDate();
        isChangeRequestActive.value = false;
        sendStatusChangeEmail("Board approved");
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
        sendStatusChangeEmail("Denied");
        updateChangeRequestStatus("Denied");
      } else if (
        isReviewer.value &&
        changeRequest.value.status === "Under review"
      ) {
        sendStatusChangeEmail("Needs changes");
        updateChangeRequestStatus("Needs changes");
      } else if (
        isBoardApprover.value &&
        changeRequest.value.status === "Pending board approval"
      ) {
        isChangeRequestActive.value = false;
        sendStatusChangeEmail("Board denied");
        updateChangeRequestStatus("Board denied");
      } else {
        showErrorMessage("You don't have the permissions to do this", $q);
      }
    }
    function sendStatusChangeEmail(newStatus) {
      axios
        .post(
          `https://test-email-server1.herokuapp.com/email/changeState/${changeRequest.value.id}`,
          {
            requestor: { email: user.email, name: "Me" },
            newStatus,
          }
        )
        .then((result) => {
          logText("Message sent");
        })
        .catch((error) => {
          logText(error);
        });
    }
    function printChangeRequest() {
      closeLeftDrawer().then((_) => {
        window.print();
      });
    }
    async function closeLeftDrawer() {
      store.isLeftDrawerOpen = false;
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
    async function updateChangeRequestBoardDate() {
      const today = new Date();
      try {
        const { error } = await supabase
          .from("change_requests")
          .update({ board_date: today })
          .match({ id: changeRequest.value.id });
        boardDate.value = formatDate(today);
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
          .update({ status: newStatus, updated_at: new Date() })
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
      generalCommentsInput,
      generalComments,
      boardCommentsInput,
      boardComments,
      boardDate,
      boardAttendeesInput,
      boardAttendeesOptions,
      boardAttendees,
      createGeneralComment,
      updateBoardAttendees,
      updateBoardComments,
      getChangeRequestComments,
      approveChangeRequest,
      denyChangeRequest,
      printChangeRequest,
    };
  },
  components: { Comment },
};
</script>

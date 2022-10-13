<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animtaed fadeOut"
  >
    <q-page class="q-pa-md q-gutter-md" style="max-width: 1000px">
      <div class="row">
        <div class="col-12 col-md-6 q-mb-sm">
          <q-input
            outlined
            label="Subject"
            stack-label
            :readonly="!(isOriginalRequestor && needsChanges)"
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
            :readonly="!(isOriginalRequestor && needsChanges)"
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
          <q-select
            class="q-ma-none q-pa-none"
            outlined
            v-model="processingSpeed"
            :readonly="!(isOriginalRequestor && needsChanges)"
            :options="processingOptions"
            label="Processing speed"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please make a selection',
            ]"
          />
        </div>
        <div class="col-12 col-md-3 offset-md-1 q-mb-sm">
          <q-select
            class="q-ma-none q-pa-none"
            outlined
            v-model="riskSeverity"
            :readonly="!(isOriginalRequestor && needsChanges)"
            :options="riskAndImpactOptions"
            label="Risk severity"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please make a selection',
            ]"
          />
        </div>
        <div class="col-12 col-md-3 offset-md-1">
          <q-select
            class="q-ma-none q-pa-none"
            outlined
            v-model="impactSeverity"
            :readonly="!(isOriginalRequestor && needsChanges)"
            :options="riskAndImpactOptions"
            label="Impact severity"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please make a selection',
            ]"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-3 q-mb-sm">
          <q-select
            class="q-ma-none q-pa-none"
            outlined
            v-model="approvingManager"
            :readonly="!(isOriginalRequestor && needsChanges)"
            :options="approvingManagerOptions"
            label="Approving manager"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please make a selection',
            ]"
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

      <div class="row">
        <div class="col-12 col-md-11">
          <h6>Description</h6>
          <div
            class="text-body-1"
            v-html="description"
            style="
              width: 100%;
              overflow-wrap: break-word;
              white-space: pre-wrap;
            "
          ></div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-11">
          <h6>Testing details</h6>
          <div
            class="text-body-1"
            v-html="testingDetails"
            style="
              width: 100%;
              overflow-wrap: break-word;
              white-space: pre-wrap;
            "
          ></div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-11">
          <h6>Recovery plan</h6>
          <div
            class="text-body-1"
            v-html="recoveryPlan"
            style="
              width: 100%;
              overflow-wrap: break-word;
              white-space: pre-wrap;
            "
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
            v-text="
              'Board attendees:\n' + (boardAttendees ? boardAttendees : '')
            "
          ></div>
          <div
            class="text-body-1"
            v-text="'Board comments:\n' + (boardComments ? boardComments : '')"
            style="
              width: 100%;
              overflow-wrap: break-word;
              white-space: pre-wrap;
            "
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
        <div class="row">
          <div class="col-12 col-md-4 q-mb-sm q-pr-sm">
            <q-btn
              v-if="needsChanges && isOriginalRequestor"
              label="Update"
              color="primary"
              style="width: 100%"
              @click="updateChangeRequest()"
            />
          </div>
        </div>
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
  </transition>
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

    const needsChanges = ref(false);
    const isOriginalRequestor = ref(false);
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
    const boardAttendeesInput = ref([]);
    const boardCommentsInput = ref(null);
    const boardAttendees = ref(null);
    const boardAttendeesOptions = ref([]);
    const boardComments = ref(null);
    const boardDate = ref(null);
    const approvingManagerOptions = ref([]);

    getApprovingManagers().then((nameData) => {
      approvingManagerOptions.value = nameData;
    });

    getBoardAttendees().then((nameData) => {
      boardAttendeesOptions.value = nameData;
    });

    async function getApprovingManagers() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select()
          .match({ user_role: "approving_manager" });

        if (error) throw error;

        const nameData = storeNamesInArray(data);
        return nameData;
      } catch (error) {
        logText(error.message);
      }
    }

    async function getBoardAttendees() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select()
          .or("user_role.eq.approving_manager, user_role.eq.board_approver");

        if (error) throw error;

        const nameData = storeNamesInArray(data);
        return nameData;
      } catch (error) {
        logText(error.message);
      }
    }

    function storeNamesInArray(data) {
      const nameList = [];
      data.forEach((nameInformation) => {
        nameList.push(nameInformation.full_name);
      });
      return nameList;
    }

    setUserRole()
      .then((_) => {
        getChangeRequest(route.params.id);
        getChangeRequestComments(route.params.id);
      })
      .catch((error) => {
        logText(error);
      });

    async function setUserRole() {
      if (store.userRole === "approving_manager") {
        isApprovingManager.value = true;
      } else if (store.userRole === "reviewer") {
        isReviewer.value = true;
      } else if (store.userRole === "board_approver") {
        isBoardApprover.value = true;
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
          setNeedsChanges();
          setIsOriginalRequestor();
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

    function setNeedsChanges() {
      needsChanges.value = changeRequest.value.status === "Needs changes";
    }

    function setIsOriginalRequestor() {
      isOriginalRequestor.value =
        user.email === changeRequest.value.requestor_email;
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
      boardAttendees.value = formatBoardAttendees(
        changeRequest.value.board_attendees
      );
      boardComments.value = changeRequest.value.board_recommendations;
      boardDate.value = changeRequest.value.board_date;

      // populate with either all possible attendees or attendees
      // that are currently selected
      boardAttendeesInput.value = boardAttendees.value
        ? boardAttendees.value.split("\n")
        : JSON.parse(JSON.stringify(boardAttendeesOptions.value));
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

    function sendCommentEmail() {
      // TODO: uncomment when Sendgrid account and subscription are chosen
      const details = {
        requestorName: changeRequest.value.requestor,
        approvingManager: changeRequest.value.approving_manager,
        commenter: user.email,
      };
      axios
        .post(
          `https://test-email-server1.herokuapp.com/email/comment/${changeRequest.value.id}`,
          details
        )
        .then((result) => {
          logText("Message sent");
        })
        .catch((error) => {
          logText(error);
        });
    }

    async function updateBoardAttendees() {
      try {
        const { error } = await supabase
          .from("change_requests")
          .update({ board_attendees: boardAttendeesInput.value })
          .match({ id: changeRequest.value.id });

        boardAttendees.value = formatBoardAttendees(boardAttendeesInput.value);

        if (error) throw error;

        showSuccessMessage("Board attendees updated", $q);
      } catch (error) {
        logText(error.message);
      }
    }

    function formatBoardAttendees(attendees) {
      return JSON.stringify(attendees)
        .replaceAll("[", "")
        .replaceAll("]", "")
        .replaceAll('"', "")
        .replaceAll("\\", "")
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

    async function updateChangeRequest() {
      try {
        const { error } = await supabase
          .from("change_requests")
          .update({
            subject: subject.value,
            tracking_number: trackingNumber.value,
            processing_speed: processingSpeed.value,
            risk_severity: riskSeverity.value,
            impact_severity: impactSeverity.value,
            approving_manager: approvingManager.value,
            status: "Under review",
            board_recommendations: boardCommentsInput.value,
          })
          .match({ id: changeRequest.value.id });

        if (error) throw error;

        needsChanges.value = false;
        status.value = "Under review";

        sendStatusChangeEmail("Under review");
        showSuccessMessage("Change request updated", $q);
      } catch (error) {
        logText(error.message);
      }
    }

    function approveChangeRequest() {
      needsChanges.value = false;

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
      // TODO: uncomment when Sendgrid account and subscription are chosen
      const details = {
        trackingNumber: changeRequest.value.tracking_number,
        status: newStatus,
        requestorName: changeRequest.value.requestor,
        approvingManager: changeRequest.value.approving_manager,
        changeDate: changeRequest.value.change_date,
        processingSpeed: changeRequest.value.processing_speed,
        riskSeverity: changeRequest.value.risk_severity,
        impactSeverity: changeRequest.value.impact_severity,
      };
      axios
        .post(
          `https://test-email-server1.herokuapp.com/email/changeState/${changeRequest.value.id}`,
          details
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
      needsChanges,
      isOriginalRequestor,
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
      approvingManagerOptions,

      processingOptions: [
        "Normal",
        "Urgent",
        "Emergency",
        "Pre-Approved by CCB",
      ],
      riskAndImpactOptions: ["High", "Medium", "Low"],

      createGeneralComment,
      updateBoardAttendees,
      updateBoardComments,
      getChangeRequestComments,
      updateChangeRequest,
      approveChangeRequest,
      denyChangeRequest,
      printChangeRequest,
    };
  },
  components: { Comment },
};
</script>

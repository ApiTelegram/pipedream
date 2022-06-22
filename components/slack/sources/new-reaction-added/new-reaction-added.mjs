import common from "../common/base.mjs";

export default {
  ...common,
  key: "slack-new-reaction-added",
  name: "New Reaction Added",
  version: "0.0.1",
  description: "Emit new event when a member has added an emoji reaction to an item",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    conversations: {
      propDefinition: [
        common.props.slack,
        "conversation",
      ],
      type: "string[]",
      label: "Channels",
      description: "Select one or more channels to monitor for new messages.",
      optional: true,
    },
    // eslint-disable-next-line pipedream/props-description,pipedream/props-label
    slackApphook: {
      type: "$.interface.apphook",
      appProp: "slack",
      async eventNames() {
        if (this.conversations.length) {
          const conversations = [];
          for (let conversation of this.conversations) {
            conversations.push(`reaction_added:${conversation}`);
          }
          return conversations;
        }

        return [
          "reaction_added",
        ];
      },
    },
    ignoreMyself: {
      propDefinition: [
        common.props.slack,
        "ignoreMyself",
      ],
    },
    ignoreBot: {
      propDefinition: [
        common.props.slack,
        "ignoreBot",
      ],
    },
  },
  methods: {
    async processEvent(event) {
      if (this.ignoreMyself && event.user == this.mySlackId()) {
        return;
      }
      if (this.ignoreBot) {
        if (event.subtype == "bot_message" || event.bot_id) {
          return;
        }
      }
      return event;
    },
  },
};

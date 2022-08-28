"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = __importDefault(require("./BaseRoute"));
const Routes = __importStar(require("../util/Routes"));
const Constants_1 = require("../Constants");
class Interactions extends BaseRoute_1.default {
    /**
     * Create a followup message.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @param {Object} options
     * @param {Object} [options.allowedMentions] - An object that specifies the allowed mentions in this message.
     * @param {Boolean} [options.allowedMentions.everyone] - If `@everyone`/`@here` mentions should be allowed.
     * @param {Boolean} [options.allowedMentions.repliedUser] - If the replied user (`messageReference`) should be mentioned.
     * @param {(Boolean | String[])} [options.allowedMentions.roles] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {(Boolean | String[])} [options.allowedMentions.users] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {Object[]} [options.attachments] - An array of [attachment information](https://discord.com/developers/docs/resources/channel#attachment-object) related to the sent files.
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send.
     * @param {String} [options.content] - The content of the message.
     * @param {Object[]} [options.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
     * @param {File[]} [options.files] - The files to send.
     * @param {Number} [options.flags] - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to send with the message.
     * @param {Boolean} [options.tts] - If the message should be spoken aloud.
     * @returns {Promise<Message<T>>}
     */
    async createFollowupMessage(applicationID, interactionToken, options) {
        return this._manager.webhooks.execute(applicationID, interactionToken, options);
    }
    /**
     * Create an initial interaction response.
     *
     * @param {String} interactionID - The ID of the interaction.
     * @param {String} interactionToken - The token of the interaction.
     * @param {Object} options
     * @param {unknown} [options.data] - The [response data](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure). Convert any `snake_case` keys to `camelCase`.
     * @param {InteractionResponseTypes} options.type - The [type](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type) of response.
     * @return {Promise<void>}
     */
    async createInteractionResponse(interactionID, interactionToken, options) {
        let data;
        switch (options.type) {
            case Constants_1.InteractionResponseTypes.PONG: break;
            case Constants_1.InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE:
            case Constants_1.InteractionResponseTypes.UPDATE_MESSAGE: {
                data = {
                    allowed_mentions: this._client._formatAllowedMentions(options.data.allowedMentions),
                    attachments: options.data.attachments,
                    content: options.data.content,
                    components: options.data.components?.map(row => ({
                        type: row.type,
                        components: row.components.map(component => {
                            if (component.type === Constants_1.ComponentTypes.BUTTON) {
                                if (component.style === Constants_1.ButtonStyles.LINK)
                                    return {
                                        disabled: component.disabled,
                                        emoji: component.emoji,
                                        label: component.label,
                                        style: component.style,
                                        type: component.type,
                                        url: component.url
                                    };
                                else
                                    return {
                                        custom_id: component.customID,
                                        disabled: component.disabled,
                                        emoji: component.emoji,
                                        label: component.label,
                                        style: component.style,
                                        type: component.type
                                    };
                            }
                            else
                                return {
                                    custom_id: component.customID,
                                    disabled: component.disabled,
                                    max_values: component.maxValues,
                                    min_values: component.minValues,
                                    options: component.options,
                                    placeholder: component.placeholder,
                                    type: component.type
                                };
                        })
                    })),
                    embeds: options.data.embeds,
                    flags: options.data.flags
                };
                break;
            }
            case Constants_1.InteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: {
                data = options.data.map(d => ({
                    name: d.name,
                    name_localizations: d.nameLocalizations,
                    value: d.value
                }));
                break;
            }
            case Constants_1.InteractionResponseTypes.MODAL: {
                data = {
                    custom_id: options.data.customID,
                    components: options.data.components.map(row => ({
                        type: row.type,
                        components: row.components.map(component => ({
                            custom_id: component.customID,
                            label: component.label,
                            max_length: component.maxLength,
                            min_length: component.minLength,
                            placeholder: component.placeholder,
                            required: component.required,
                            style: component.style,
                            type: component.type,
                            value: component.value
                        }))
                    })),
                    title: options.data.title
                };
                break;
            }
            default: {
                data = options.data;
                break;
            }
        }
        await this._manager.authRequest({
            method: "POST",
            path: Routes.INTERACTION_CALLBACK(interactionID, interactionToken),
            json: {
                data,
                type: options.type
            }
        });
    }
    /**
     * Delete a follow up message.
     *
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @param {String} messageID - The ID of the message.
     * @returns {Promise<void>}
     */
    async deleteFollowupMessage(applicationID, interactionToken, messageID) {
        await this._manager.webhooks.deleteMessage(applicationID, interactionToken, messageID);
    }
    /**
     * Delete the original interaction response. Does not work with ephemeral messages.
     *
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @returns {Promise<void>}
     */
    async deleteOriginalMessage(applicationID, interactionToken) {
        await this._manager.webhooks.deleteMessage(applicationID, interactionToken, "@original");
    }
    /**
     * Edit a followup message.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @param {String} messageID - The ID of the message.
     * @param {Object} options
     * @param {Object} [options.allowedMentions] - An object that specifies the allowed mentions in this message.
     * @param {Boolean} [options.allowedMentions.everyone] - If `@everyone`/`@here` mentions should be allowed.
     * @param {Boolean} [options.allowedMentions.repliedUser] - If the replied user (`messageReference`) should be mentioned.
     * @param {(Boolean | String[])} [options.allowedMentions.roles] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {(Boolean | String[])} [options.allowedMentions.users] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {Object[]} [options.attachments] - An array of [attachment information](https://discord.com/developers/docs/resources/channel#attachment-object) related to the sent files.
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send.
     * @param {String} [options.content] - The content of the message.
     * @param {Object[]} [options.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
     * @param {File[]} [options.files] - The files to send.
     * @param {Number} [options.flags] - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to send with the message.
     * @param {Boolean} [options.tts] - If the message should be spoken aloud.
     * @returns {Promise<Message<T>>}
     */
    async editFollowupMessage(applicationID, interactionToken, messageID, options) {
        return this._manager.webhooks.editMessage(applicationID, interactionToken, messageID, options);
    }
    /**
     * Edit an original interaction response.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @param {Object} options
     * @param {Object} [options.allowedMentions] - An object that specifies the allowed mentions in this message.
     * @param {Boolean} [options.allowedMentions.everyone] - If `@everyone`/`@here` mentions should be allowed.
     * @param {Boolean} [options.allowedMentions.repliedUser] - If the replied user (`messageReference`) should be mentioned.
     * @param {(Boolean | String[])} [options.allowedMentions.roles] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {(Boolean | String[])} [options.allowedMentions.users] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {Object[]} [options.attachments] - An array of [attachment information](https://discord.com/developers/docs/resources/channel#attachment-object) related to the sent files.
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send.
     * @param {String} [options.content] - The content of the message.
     * @param {Object[]} [options.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
     * @param {File[]} [options.files] - The files to send.
     * @param {Number} [options.flags] - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to send with the message.
     * @param {Boolean} [options.tts] - If the message should be spoken aloud.
     * @returns {Promise<Message<T>>}
     */
    async editOriginalMessage(applicationID, interactionToken, options) {
        return this._manager.webhooks.editMessage(applicationID, interactionToken, "@original", options);
    }
    /**
     * Get a followup message.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @param {String} messageID - The ID of the message.
     * @returns {Promise<Message<T>>}
     */
    async getFollowupMessage(applicationID, interactionToken, messageID) {
        return this._manager.webhooks.getMessage(applicationID, interactionToken, messageID);
    }
    /**
     * Get an original interaction response.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} applicationID - The ID of the application.
     * @param {String} interactionToken - The token of the interaction.
     * @returns {Promise<Message<T>>}
     */
    async getOriginalMessage(applicationID, interactionToken) {
        return this._manager.webhooks.getMessage(applicationID, interactionToken, "@original");
    }
}
exports.default = Interactions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3JvdXRlcy9JbnRlcmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDREQUFvQztBQUdwQyx1REFBeUM7QUFDekMsNENBQXNGO0FBS3RGLE1BQXFCLFlBQWEsU0FBUSxtQkFBUztJQUMvQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FvQkc7SUFDSCxLQUFLLENBQUMscUJBQXFCLENBQWdDLGFBQXFCLEVBQUUsZ0JBQXdCLEVBQUUsT0FBMkI7UUFDbkksT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUksYUFBYSxFQUFFLGdCQUFnQixFQUFFLE9BQW9DLENBQUMsQ0FBQztJQUNwSCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsS0FBSyxDQUFDLHlCQUF5QixDQUFDLGFBQXFCLEVBQUUsZ0JBQXdCLEVBQUUsT0FBNEI7UUFDekcsSUFBSSxJQUF5QixDQUFDO1FBQzlCLFFBQVEsT0FBTyxDQUFDLElBQUksRUFBRTtZQUNsQixLQUFLLG9DQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU07WUFDMUMsS0FBSyxvQ0FBd0IsQ0FBQywyQkFBMkIsQ0FBQztZQUMxRCxLQUFLLG9DQUF3QixDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUMxQyxJQUFJLEdBQUc7b0JBQ0gsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztvQkFDbkYsV0FBVyxFQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVztvQkFDMUMsT0FBTyxFQUFXLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTztvQkFDdEMsVUFBVSxFQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMs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
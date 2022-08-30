import Base from "./Base";
import Permission from "./Permission";
import type Guild from "./Guild";
import type Client from "../Client";
import type { RawRole, RoleTags } from "../types/guilds";
import type { JSONRole } from "../types/json";
/** Represents a role in a guild. */
export default class Role extends Base {
    /** The color of this role. */
    color: number;
    /** The guild this role is in. */
    guild: Guild;
    /** The id of the guild this role is in. */
    guildID: string;
    /** If this role is hoisted. */
    hoist: boolean;
    /** The icon has of this role. */
    icon: string | null;
    /** If this role is managed by an integration. */
    managed: boolean;
    /** If this role can be mentioned by anybody. */
    mentionable: boolean;
    /** The name of this role. */
    name: string;
    /** The permissions of this role. */
    permissions: Permission;
    /** The position of this role. */
    position: number;
    /** The [tags](https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure) of this role. */
    tags: RoleTags;
    /** The unicode emoji of this role. */
    unicodeEmoji: string | null;
    constructor(data: RawRole, client: Client, guildID: string);
    protected update(data: Partial<RawRole>): void;
    /** A string that will mention this role. */
    get mention(): string;
    /**
     * Delete this role.
     * @param reason - The reason for deleting the role.
     */
    delete(reason?: string): Promise<void>;
    toJSON(): JSONRole;
}

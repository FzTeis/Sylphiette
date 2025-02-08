import {
    Browsers,
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} from "@whiskeysockets/baileys";

import pino from "pino";
import chalk from "chalk";
import { join, resolve } from "path";
import { makeWASocket } from "./simple.js";

export let conn = null;
export let conns = new Map();
export const authFolder = "Sesion Subbots/";
export const authState = await useMultiFileAuthState(join(authFolder, "parent"));

export const logger = pino({ level: "silent" });

export async function start(conn = null, opts = { authState, isChild: false, usePairingCode: false }) {
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

    /** @type {import('@adiwajshing/baileys').UserFacingSocketConfig} */
    const socketConfig = {
        version, logger,
        printQRInTerminal: !(opts.usePairingCode || opts.isChild),
        browser: Browsers.ubuntu("Opera"),
		qrTimeout: 20000,
        auth: {
            creds: opts.authState.state.creds,
            keys: makeCacheableSignalKeyStore(opts.authState.state.keys, logger.child({ stream: "store" }))
        }
    };

    /** @type {Socket} sock */
    const sock = makeWASocket(socketConfig, {
        ...(conn && conn?.chats ? { chats: conn.chats } : {})
    });

    if (conn) {
		sock.isInit = conn.isInit;
		sock.isReloadInit = conn.isReloadInit;
	};
	
	if (sock.isInit == null) {
		sock.isInit = false;
		sock.isReloadInit = true;
	};
	
	// @ts-ignore
	await reload(sock, false, opts).catch(console.error);
	return sock;
};

let oldHandler = null;
export async function reload(sock, force = false, opts = { authState, isChild: false, usePairingCode: false }) {
    if (!opts.handler) opts.handler = await importFile("./handler.js");
    if (opts.handler instanceof Promise) opts.handler = await opts.handler;
    if (!opts.handler && oldHandler) opts.handler = oldHandler;
    oldHandler = opts.handler;

    const isReloadInit = !!sock.isReloadInit;
    if (force) {
        console.log("restarting connection...");
        // eslint-disable-next-line no-empty
		try { sock.ws.close() } catch { };
		// @ts-ignore
		sock.ev.removeAllListeners();
		Object.assign(sock, await start(sock, opts) || {});
    };

    Object.assign(sock, messageConfig());
    if (!isReloadInit) {
        console.log("closing connection...");
		if (sock.credsUpdate) sock.ev.off("creds.update", sock.credsUpdate);
		if (sock.handler) sock.ev.off("messages.upsert", sock.handler);
		if (sock.participantsUpdate) sock.ev.off("group-participants.update", sock.participantsUpdate);
		if (sock.groupsUpdate) sock.ev.off("groups.update", sock.groupsUpdate);
		if (sock.onDelete) sock.ev.off("message.delete", sock.onDelete);
		if (sock.connectionUpdate) sock.ev.off("connection.update", sock.connectionUpdate);
    };

    if (opts.handler) {
		if (opts.handler?.handler) sock.handler = opts.handler.handler.bind(sock);
		if (opts.handler?.participantsUpdate) sock.participantsUpdate = opts.handler.participantsUpdate.bind(sock);
		if (opts.handler?.groupsUpdate) sock.groupsUpdate = opts.handler.groupsUpdate.bind(sock);
		if (opts.handler?.deleteUpdate) sock.onDelete = opts.handler.deleteUpdate.bind(sock);
	};
	
	if (!opts.isChild) sock.connectionUpdate = connectionUpdate.bind(sock, opts);
	sock.credsUpdate = opts.authState?.saveCreds.bind(sock);

	if (sock.handler) sock.ev.on("messages.upsert", sock.handler);
	if (sock.participantsUpdate) sock.ev.on("group-participants.update", sock.participantsUpdate);
	if (sock.groupsUpdate) sock.ev.on("groups.update", sock.groupsUpdate);
	if (sock.onDelete) sock.ev.on("message.delete", sock.onDelete);
	if (sock.connectionUpdate) sock.ev.on("connection.update", sock.connectionUpdate);
	if (sock.credsUpdate) sock.ev.on("creds.update", sock.credsUpdate);
	
	sock.isReloadInit = false;
	return true;
};

export function messageConfig() {
	return {
		welcome: "Bienvenido @user!\n",
		bye: "Goodbye @user 👋",
		spromote: "@user ahora es admin!",
		sdemote: "@user ya no es admin!",
		sDesc: "La descripción fue actualizada \n@desc",
		sSubject: "El nombre del grupo cambió a \n@subject",
		sIcon: "El icono del grupo fue actualizado!",
		sRevoke: "El link del grupo fue actualizado \n@revoke"
	};
};

async function connectionUpdate(opts, update) {
	const { receivedPendingNotifications, connection, lastDisconnect, isOnline, isNewLogin } = update;
	if (isNewLogin) console.log(chalk.green('Login Berhasil!'));
	if (connection == 'connecting') console.log(chalk.redBright('Mengaktifkan Bot, Mohon tunggu sebentar...'));
	if (connection == 'open') console.log(chalk.green('Tersambung'));
	if (isOnline == true) console.log(chalk.green('Status Aktif'));
	if (isOnline == false) console.log(chalk.red('Status Mati'));
	if (receivedPendingNotifications) console.log(chalk.yellow('Menunggu Pesan Baru'));
	if (connection == "close") {
		console.log(chalk.red('koneksi terputus & mencoba menyambung ulang...'));
		const status = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;

		if (status !== DisconnectReason.loggedOut && status !== DisconnectReason.blockedNumber) {
			console.log({ status, message: lastDisconnect.error?.output?.payload?.message ?? lastDisconnect.error?.output?.payload?.statusMessage ?? "", disconnectReason: DisconnectReason[status] });
			console.log(chalk.red('Connecting...'));
			console.log(await reload(this, true, opts).catch(console.error));
		};
	};
	
	if (global.db.data == null) await global.loadDatabase();
};

export async function importFile(module) {
	module = resolve(module);
	module = await import(`${module}?id=${Date.now()}`);
	module = module && module.default ? module.default : module;
	return module;
};

export let opts = { authState, isChild: false, usePairingCode: false };

export default {
	conn,
	opts,
	conns,

	logger,
	authFolder,

	start,
	reload,
	importFile
};
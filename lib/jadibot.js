const captionPairing = `
Codigo: %code
`.trim();
const captionQR = `
Escanea el codigo qr para convertirte en un bot temporal.
El codigo qr expira en %time segundos.

QR Count: %count/3
`.trim();
import qrcode from 'qrcode';
import { join } from 'path';
import { existsSync, promises as fs } from 'fs';
import { delay, DisconnectReason, areJidsSameUser, jidNormalizedUser, useMultiFileAuthState } from '@whiskeysockets/baileys';
import conexion, { start, reload, authFolder as jbkeni } from './jadibots.js';
export async function Jadibot(numerxd, _0x3ce648 = conexion.conn, _0x4790a9 = null, _0x57ac2b = false) {
  numerxd = jidNormalizedUser(numerxd);
  if (numerxd && numerxd.startsWith('0')) {
    numerxd = '54' + numerxd.slice(0x1) + "@s.whatsapp.net";
  }
  const userjb = numerxd && numerxd.split('@')[0x0];
  if (!userjb) {
    throw new Error("Invalid JID");
  }
  const _0xaca750 = await startBot(numerxd, _0x3ce648, _0x4790a9, _0x57ac2b);
  if (_0xaca750 && _0xaca750.user?.["jid"] && !areJidsSameUser(_0xaca750.user.jid, numerxd)) {
    console.log("JID mismatch, expected:", numerxd, "got:", _0xaca750.user.jid);
    try {
      await _0xaca750.end();
      const _0x7085e = join(jbkeni, userjb);
      const _0x308f17 = join(jbkeni, _0xaca750.user.jid.split('@')[0x0]);
      await fs.rename(_0x7085e, _0x308f17);
      numerxd = _0xaca750.user.jid;
    } catch (_0x515d6c) {
      console.error(_0x515d6c);
      numerxd = null;
    } finally {
      if (!numerxd) {
        throw new Error("Failed to start bot");
      }
      conexion.conns["delete"](userjb);
      await delay(0x7d0);
      return Jadibot(numerxd, _0x3ce648, _0x4790a9, _0x57ac2b);
    }
    ;
  }
  ;
  return _0xaca750;
}
;
export async function startBot(numerojbs, conn = conexion.conn, _0xa5eb5e = null, _0x3f98a6) {
  let _0x55e55f;
  let _0x2f426e = 0x0;
  const _0x4abfd1 = numerojbs.split`@`[0x0];
  const _0x55f71d = join(jbkeni, _0x4abfd1);
  const _0x10b879 = [...conexion.conns.entries()].map(([_0x4a236a, _0x99bde6]) => _0x99bde6.user?.["jid"]);
  if (_0x10b879.includes(numerojbs)) {
    throw "Bot already running";
  }
  const _0x3b7a85 = await useMultiFileAuthState(_0x55f71d);
  const _0x5074af = {
    'authState': _0x3b7a85,
    'isChild': true,
    'usePairingCode': _0x3f98a6
  };
  const _0x36c71c = await start(null, _0x5074af);
  const _0x2697f0 = _0x3f98a6 ? "Pairing code" : "QR code";
  const sexo = async (..._0x43bcc9) => {
    return conn && conn.reply(..._0x43bcc9) || console.log(..._0x43bcc9);
  };
  let _0x356bde;
  if (_0x3f98a6 && !_0x36c71c?.["authState"]?.["creds"]?.["registered"]) {
    await delay(0x5dc);
    try {
      _0x356bde = await _0x36c71c.requestPairingCode(_0x4abfd1);
      _0x356bde = _0x356bde?.['match'](/.{1,4}/g)?.["join"]?.('-') || _0x356bde;
      if (_0xa5eb5e) {
        await sexo(_0xa5eb5e?.['chat'] ?? numerojbs, captionPairing.replace(/%code/g, _0x356bde), _0xa5eb5e);
        await sexo(_0xa5eb5e?.["chat"] ?? numerojbs, String(_0x356bde), _0xa5eb5e);
      }
      ;
    } catch (_0x3c402e) {
      console.error(_0x3c402e);
      throw "Failed to request pairing code";
    }
    ;
  }
  ;
  _0x36c71c.ev.on("connection.update", async _0x3db220 => {
    const {
      qr: _0x410767,
      connection: _0x1fccbf,
      lastDisconnect: _0x353c42,
      isNewLogin: _0x581ff9,
      receivedPendingNotifications: _0x37188e
    } = _0x3db220;
    if (_0x410767 && !_0x3f98a6 && _0xa5eb5e) {
      if (_0x2f426e >= 0x3) {
        await sexo(_0xa5eb5e.chat, "QRCode expired!");
        try {
          _0x36c71c.ws.close();
        } catch {}
        ;
        _0x36c71c.ev.removeAllListeners();
        _0x2f426e = 0x0;
        if (existsSync(_0x55f71d)) {
          await fs.rm(_0x55f71d, {
            'recursive': true
          })["catch"](console.error);
        }
        if (_0x55e55f && _0x55e55f?.["key"]) {
          await conn.sendMessage(_0xa5eb5e.chat, {
            'delete': _0x55e55f.key
          });
        }
      } else {
        if (_0x55e55f && _0x55e55f?.["key"]) {
          await conn.sendMessage(_0xa5eb5e.chat, {
            'delete': _0x55e55f.key
          });
        }
        _0x2f426e++;
        try {
          const _0x31402c = await qrcode.toBuffer(_0x410767, {
            'scale': 0x8,
            'margin': 0x4,
            'width': 0x100,
            'color': {
              'dark': "#000000ff",
              'light': "#ffffffff"
            }
          });
          _0x55e55f = await conn.sendFile(_0xa5eb5e.chat, _0x31402c, "qr.png", captionQR.replace(/%time/g, _0x36c71c?.['ws']?.["config"]?.["qrTimeout"] / 0x3e8 || 0x14).replace(/%count/g, _0x2f426e), _0xa5eb5e);
        } catch (_0x1e77bf) {
          console.error(_0x1e77bf);
        }
        ;
      }
    }
    ;
    const _0x1a5e6f = _0x353c42?.["error"]?.["output"]?.["statusCode"] ?? _0x353c42?.["error"]?.["output"]?.["payload"]?.['statusCode'];
    const _0x55a3ae = _0x353c42?.['error']?.["output"]?.["message"] ?? _0x353c42?.['error']?.["output"]?.["payload"]?.["message"];
    if (_0x1fccbf === "close") {
      (_0x36c71c.logger ?? conn.logger ?? console).error("Connection closed: " + _0x55a3ae + "\nID: " + jidNormalizedUser(_0x36c71c?.["user"]?.["jid"] ?? _0x36c71c?.["user"]?.['id'] ?? '') + "\nStatus: " + _0x1a5e6f + "\nReason: " + DisconnectReason[_0x1a5e6f]);
    } else {
      if (_0x1fccbf === "open" && !_0x581ff9) {
        if (_0xa5eb5e && _0xa5eb5e?.["chat"]) {
          await sexo(_0xa5eb5e.chat, "Conexión exitosa!", _0xa5eb5e);
        }
      }
    }
    if (_0x1a5e6f) {
      console.log("Handling status code of disconnect reason:", {
        'status': _0x1a5e6f,
        'message': _0x55a3ae
      });
      if (_0x1a5e6f !== DisconnectReason.loggedOut && _0x1a5e6f !== DisconnectReason.connectionReplaced && _0x1a5e6f !== DisconnectReason.timedOut && _0x1a5e6f !== DisconnectReason.forbidden) {
        await reload(_0x36c71c, true, _0x5074af)['catch'](console.error);
      } else {
        if (_0x1a5e6f === DisconnectReason.timedOut) {
          console.log("Connection timed out!");
          if (_0xa5eb5e && !_0x36c71c.authState?.['creds']?.["registered"]) {
            await sexo(_0xa5eb5e.chat, "Codigo Expirado!");
            if (existsSync(_0x55f71d)) {
              await fs.rm(_0x55f71d, {
                'recursive': true
              })["catch"](console.error);
            }
          } else if (_0x36c71c.authState?.["creds"]?.['registered']) {
            _0x36c71c.logger.info("Connection timed out, restarting...");
            await reload(_0x36c71c, true, _0x5074af)["catch"](console.error);
          }
        } else {
          if (_0x1a5e6f === DisconnectReason.loggedOut || _0x1a5e6f === DisconnectReason.forbidden) {
            if (existsSync(_0x55f71d)) {
              await fs.rm(_0x55f71d, {
                'recursive': true
              })["catch"](console.error);
            }
            console.log("Logged out or forbidden, stoping all events...");
            if (conexion.conns.has(_0x4abfd1)) {
              conexion.conns["delete"](_0x4abfd1);
            }
            const _0xf2a41d = _0xa5eb5e?.['chat'] || _0x36c71c?.["user"]?.["jid"] || numerojbs;
            const _0x4d0a6b = _0x1a5e6f === DisconnectReason.loggedOut ? "Logged out" : 'Forbidden';
            await sexo(_0xf2a41d, "STATE: " + _0x4d0a6b + ", bot desconectado!", _0xa5eb5e);
          }
        }
      }
      ;
    }
    ;
    if (_0x581ff9) {
      _0x36c71c.logger.info(_0x4abfd1, "Logged in");
      if (_0xa5eb5e) {
        let _0x15e64a = await _0xa5eb5e.reply("Conexión exitosa!");
        await delay(0x3e8);
        await _0x36c71c.reply(_0xa5eb5e.chat, "OK!", _0x15e64a);
      }
      ;
    }
  });
  let _0x49da95 = 0x0;
  let _0x2431f4 = () => new Promise(_0x4f5225 => _0x36c71c?.["user"]?.["jid"] ? _0x4f5225() : (_0x49da95++, setTimeout(() => _0x4f5225(_0x2431f4()), 0x7d0)));
  await _0x2431f4();
  if (_0x36c71c?.["user"]?.["jid"] && !_0x10b879.includes(_0x36c71c.user.jid)) {
    conexion.conns.set(_0x4abfd1, _0x36c71c);
  }
  return _0x36c71c;
}
;
export async function restoreSession(_0x344051 = null) {
  for (const _0x7cad87 of await fs.readdir(jbkeni)) {
    await delay(0x3e8);
    if (/parent/.test(_0x7cad87)) {
      continue;
    }
    if (!existsSync(join(jbkeni, _0x7cad87, "creds.json"))) {
      continue;
    }
    if (conexion.conns.has(_0x7cad87)) {
      continue;
    }
    await Jadibot(_0x7cad87 + "@s.whatsapp.net", _0x344051);
  }
  ;
}
;
export default Jadibot;
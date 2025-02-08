const handler = async (m, {conn, usedPrefix, command}) => {
  const room = Object.values(conn.game).find((room) => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender));
  if (room == undefined) return conn.reply(`> No estas en una partida actualmente`);
  delete conn.game[room.id];
  await m.reply('*[ ✔ ] Se eliminó con éxito la sala*');
};
handler.command = /^(delttt|deltt|delxo|deltictactoe)$/i;
handler.fail = null;
export default handler;
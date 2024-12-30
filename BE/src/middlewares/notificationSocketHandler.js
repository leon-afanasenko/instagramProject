export const notificationSocketHandler = (socket, io) => {
  socket.on("joinNotifications", (userId) => {
    socket.join(`notifications:${userId}`);
    console.log(`User ${userId} joined notifications room`);
  });

  socket.on("leaveNotifications", (userId) => {
    socket.leave(`notifications:${userId}`);
    console.log(`User ${userId} left notifications room`);
  });
};

export const emitNotification = (io, userId, notification) => {
  io.to(`notifications:${userId}`).emit("newNotification", notification);
};

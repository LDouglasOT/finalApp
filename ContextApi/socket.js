import io from 'socket.io-client';

const socket = io('ws://socketserver-fimb.onrender.com');

export default socket;
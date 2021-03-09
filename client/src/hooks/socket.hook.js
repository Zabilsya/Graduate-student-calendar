import {useState, useCallback, useEffect} from 'react'
import io from 'socket.io-client';
import URLs from './../URLs';

export const useSocket = () => {
    const [events, setEvents] = useState(null)

    const socket = io(`${URLs.socketURL}/socket`);

    socket.on("newEvent", (event) => {
      setEvents([...events, event])
    });

    socket.on("deletedEvent", (id) => {
      const updatedThoughts = this.state.thoughts.filter((thought) => {
        return thought._id !== id;
      });

      this.setState({ thoughts: updatedThoughts });
    });


}
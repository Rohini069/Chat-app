import { Text, useToast } from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState("");
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);

    try {
      // Ensure user token is defined
      if (!user || !user.token) {
        throw new Error("User token not defined");
      }
      // console.log("User token:", user.token);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);

  return (
    <>
      <Box
        d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="2xl" mb={3}>
          My Chats
        </Text>
        {chats ? (
          chats.map((chat) => (
            <Box
              key={chat._id}
              p={2}
              w="100%"
              mb={2}
              bg="gray.100"
              borderRadius="lg"
              onClick={() => setSelectedChat(chat)}
              cursor="pointer"
              _hover={{ bg: "gray.200" }}
            >
              <Text>{chat.chatName}</Text>
            </Box>
          ))
        ) : (
          <Text>Loading chats...</Text>
        )}
      </Box>
    </>
  );
};

export default MyChats;

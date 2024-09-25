'use client';

import { useMutation } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { useRef, useState } from 'react';

import { getAIAnswer } from '@/apiCallers/AIchatBot';
import { Button } from '@/components/ui/button';
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import {
  ExpandableChat,
  ExpandableChatBody,
  ExpandableChatFooter,
  ExpandableChatHeader,
} from '@/components/ui/chat/expandable-chat';

import { Input } from './ui/input';

export default function ChatSupport() {
  const [chatList, setChatList] = useState<
    {
      message: string;
      type: 'sent' | 'received';
    }[]
  >([
    {
      message:
        'Xin chào,tôi là AI về PickleBall đẹp trai siêu cấp vũ trụ, bạn cần giúp gì không?',
      type: 'received',
    },
    {
      message:
        'Trong câu hỏi của bạn nên chứa từ khóa "PickleBall" để tôi có thể trả lời chính xác hơn nhé!',
      type: 'received',
    },
  ]);
  const bottom = useRef(null);
  const scrollToBottom = () => {
    if (bottom.current) bottom.current.scrollIntoView({ behavior: 'smooth' });
  };
  const { mutateAsync: getAIAnswerMutation, isPending: isAIAnswerLoading } =
    useMutation({
      mutationFn: async (mess: string) => {
        return getAIAnswer(mess);
      },
    });

  const [message, setMessage] = useState('');

  const handleSendMessage = async (message: string) => {
    scrollToBottom();
    setChatList((prevChatList) => [
      ...prevChatList,
      {
        message,
        type: 'sent',
      },
    ]);
    try {
      console.log('message', message);

      const res = await getAIAnswerMutation(message);

      setChatList((prevChatList) => [
        ...prevChatList,
        {
          message: res?.result,
          type: 'received',
        },
      ]);
    } catch (error) {
      console.log(error);
    }
    scrollToBottom();
  };

  return (
    <ExpandableChat size='lg' position='bottom-right'>
      <ExpandableChatHeader className='flex-col justify-center text-center'>
        <h1 className='text-xl font-semibold'>Chat with our AI Staff ✨</h1>
        <p>Ask any question for our AI Staff to answer</p>
      </ExpandableChatHeader>
      <ExpandableChatBody>
        <ChatMessageList>
          {chatList.map((chat, index) => (
            <ChatBubble key={index} variant={chat.type}>
              <ChatBubbleAvatar fallback={chat.type == 'sent' ? 'US' : 'AI'} />
              <ChatBubbleMessage variant={chat.type}>
                {chat.message}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
          {isAIAnswerLoading && (
            <ChatBubble variant='received'>
              <ChatBubbleAvatar fallback='AI' />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
          <div ref={bottom} />
          {/* <ChatBubble variant='sent'>
            <ChatBubbleAvatar fallback='US' />
            <ChatBubbleMessage variant='sent'>
              Hello, how has your day been? I hope you are doing well.
            </ChatBubbleMessage>
          </ChatBubble>
          <ChatBubble variant='received'>
            <ChatBubbleAvatar fallback='AI' />
            <ChatBubbleMessage variant='received'>
              Hi, I am doing well, thank you for asking. How can I help you
              today?
            </ChatBubbleMessage>
          </ChatBubble>
          <ChatBubble variant='received'>
            <ChatBubbleAvatar fallback='AI' />
            <ChatBubbleMessage isLoading />
          </ChatBubble> */}
        </ChatMessageList>
      </ExpandableChatBody>
      <ExpandableChatFooter className='flex items-center gap-4 '>
        <form className='flex w-full items-center gap-2'>
          <Input
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            value={message}
            placeholder='Type your message here...'
          />
          {!isAIAnswerLoading && (
            <Button
              type='submit'
              size='icon'
              onClick={() => {
                if (message.length == 0) return;
                handleSendMessage(message);
                setMessage('');
                scrollToBottom();
              }}
            >
              <Send className='size-4' />
            </Button>
          )}
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}

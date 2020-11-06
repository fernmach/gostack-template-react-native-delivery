import React, { useState, useEffect } from 'react';

import Icon from 'react-native-vector-icons/Feather';

import { Container, Overlay, OverlayContainer, Message } from './styles';

interface OverlayMessageProps {
  isVisible?: boolean;
  icon: string;
  message: string;
  timeout?: number;
  iconColor?: string;
  onTimeout?(): void;
  onClose?(): void;
}

const OverlayMessage: React.FC<OverlayMessageProps> = ({
  isVisible = false,
  icon = 'thumbs-up',
  message,
  timeout = 2000,
  iconColor = '#39B100',
  ...props
}: OverlayMessageProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    const timeoutHandle = setTimeout(() => {
      if (visible) {
        setVisible(false);

        if (props.onTimeout) {
          props.onTimeout();
        }
      }
    }, timeout);
    return () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
    };
  }, [visible, props, timeout]);

  const toggleOverlay = (): void => {
    setVisible(!visible);

    if (props.onClose && !visible === false) {
      props.onClose();
    }
  };

  return (
    <Container>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <OverlayContainer>
          {icon && <Icon name={icon} size={40} color={iconColor} />}
          <Message>{message}</Message>
        </OverlayContainer>
      </Overlay>
    </Container>
  );
};

export default OverlayMessage;

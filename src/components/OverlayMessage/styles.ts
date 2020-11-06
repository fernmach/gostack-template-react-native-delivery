import styled from 'styled-components/native';
import {Overlay as NativeOverlay} from 'react-native-elements';

export const Container = styled.View``

export const Overlay = styled(NativeOverlay).attrs({
  backdropStyle: {
    backgroundColor: '#000',
    opacity: 0.9
  },
  overlayStyle:{
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    width: '100%',
    padding: 0
  }
})``

export const OverlayContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;

  background-color: transparent;
  opacity: 0.9;
`;

export const Message = styled.Text`
  font-family: 'Poppins-Bold';
  font-size: 24px;

  margin-top: 28px;
  color: #fff;
`;


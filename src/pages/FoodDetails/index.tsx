import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react';
import { Image } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import formatValue from '../../utils/formatValue';

import api from '../../services/api';

import OverlayMessage from '../../components/OverlayMessage';

import {
  Container,
  Header,
  ScrollContainer,
  FoodsContainer,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
  AdditionalsContainer,
  Title,
  TotalContainer,
  AdittionalItem,
  AdittionalItemText,
  AdittionalQuantity,
  PriceButtonContainer,
  TotalPrice,
  QuantityContainer,
  FinishOrderButton,
  ButtonText,
  IconContainer,
} from './styles';

interface Params {
  id: number;
}

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
}

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  thumbnail_url: string;
  formattedPrice: string;
  extras: Extra[];
  category: number;
}

const FoodDetails: React.FC = () => {
  const [food, setFood] = useState({} as Food);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [foodQuantity, setFoodQuantity] = useState(1);

  const [isMessageVisisble, setIsMessageVisisble] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    const source = api.CancelToken.source();

    async function loadFood(): Promise<void> {
      try {
        const { id } = routeParams;

        const response = await api.get<Food>(`foods/${id}`, {
          cancelToken: source.token,
        });

        setFood({
          ...response.data,
          formattedPrice: formatValue(response.data.price),
        });

        setExtras(
          response.data.extras.map((extra: Omit<Extra, 'quantity'>) => {
            return { ...extra, quantity: 0 };
          }),
        );
      } catch (error) {
        if (!api.isCancel(error)) {
          throw error;
        }
      }
    }

    loadFood();

    return () => {
      source.cancel();
    };
  }, [routeParams]);

  useEffect(() => {
    const source = api.CancelToken.source();

    async function loadFavorite(): Promise<void> {
      try {
        const { id } = routeParams;

        const favorite = await api.get<Food[]>(`favorites`, {
          params: { id },
          cancelToken: source.token,
        });

        if (favorite.data.length) {
          setIsFavorite(true);
        }
      } catch (error) {
        if (!api.isCancel(error)) {
          throw error;
        }
      }
    }

    loadFavorite();

    return () => {
      source.cancel();
    };
  }, [routeParams]);

  function handleIncrementExtra(id: number): void {
    const newExtras = extras.map(item => {
      return item.id !== id ? item : { ...item, quantity: item.quantity + 1 };
    });

    setExtras(newExtras);
  }

  function handleDecrementExtra(id: number): void {
    const newExtras = extras.map(item => {
      return item.id !== id
        ? item
        : {
            ...item,
            quantity: item.quantity !== 0 ? item.quantity - 1 : 0,
          };
    });

    setExtras(newExtras);
  }

  function handleIncrementFood(): void {
    setFoodQuantity(foodQuantity + 1);
  }

  function handleDecrementFood(): void {
    setFoodQuantity(foodQuantity !== 1 ? foodQuantity - 1 : 1);
  }

  const toggleFavorite = useCallback(async () => {
    const source = api.CancelToken.source();
    const newIsFavorite = !isFavorite;

    try {
      const { id } = routeParams;

      if (newIsFavorite) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { formattedPrice: _rem1, extras: _rem2, ...foodRecord } = food;

        await api.post<Food>('favorites', foodRecord, {
          cancelToken: source.token,
        });
      } else {
        await api.delete(`favorites/${id}`, {
          cancelToken: source.token,
        });
      }

      setIsFavorite(newIsFavorite);
    } catch (error) {
      if (!api.isCancel(error)) {
        throw error;
      }
    }

    return () => {
      source.cancel();
    };
  }, [isFavorite, food, routeParams]);

  const cartTotal = useMemo(() => {
    const extraTotal = extras.reduce((accumulator, extra) => {
      const newValue = accumulator + extra.value * extra.quantity;
      return newValue;
    }, 0);

    const total = (food.price + extraTotal) * foodQuantity;

    return formatValue(total || 0);
  }, [extras, food, foodQuantity]);

  async function handleFinishOrder(): Promise<void> {
    const source = api.CancelToken.source();

    try {
      const {
        id: product_id,
        name,
        description,
        price,
        category,
        thumbnail_url,
      } = food;

      await api.post<Food[]>(
        'orders',
        {
          product_id,
          name,
          description,
          price,
          category,
          thumbnail_url,
          extras,
        },
        {
          cancelToken: source.token,
        },
      );

      setIsMessageVisisble(true);
    } catch (error) {
      if (!api.isCancel(error)) {
        throw error;
      }
    }
  }

  // Calculate the correct icon name
  const favoriteIconName = useMemo(
    () => (isFavorite ? 'favorite' : 'favorite-border'),
    [isFavorite],
  );

  const onOverlayTimeout = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onOverlayClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useLayoutEffect(() => {
    // Add the favorite icon on the right of the header bar
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcon
          name={favoriteIconName}
          size={24}
          color="#FFB84D"
          onPress={() => toggleFavorite()}
        />
      ),
    });
  }, [navigation, favoriteIconName, toggleFavorite]);

  return (
    <Container>
      <Header />
      <ScrollContainer>
        <FoodsContainer>
          <Food>
            <FoodImageContainer>
              <Image
                style={{ width: 327, height: 183 }}
                source={{
                  uri: food.image_url,
                }}
              />
            </FoodImageContainer>
            <FoodContent>
              <FoodTitle>{food.name}</FoodTitle>
              <FoodDescription>{food.description}</FoodDescription>
              <FoodPricing>{food.formattedPrice}</FoodPricing>
            </FoodContent>
          </Food>
        </FoodsContainer>
        <AdditionalsContainer>
          <Title>Adicionais</Title>
          {extras.map(extra => (
            <AdittionalItem key={extra.id}>
              <AdittionalItemText>{extra.name}</AdittionalItemText>
              <AdittionalQuantity>
                <Icon
                  size={15}
                  color="#6C6C80"
                  name="minus"
                  onPress={() => handleDecrementExtra(extra.id)}
                  testID={`decrement-extra-${extra.id}`}
                />
                <AdittionalItemText testID={`extra-quantity-${extra.id}`}>
                  {extra.quantity}
                </AdittionalItemText>
                <Icon
                  size={15}
                  color="#6C6C80"
                  name="plus"
                  onPress={() => handleIncrementExtra(extra.id)}
                  testID={`increment-extra-${extra.id}`}
                />
              </AdittionalQuantity>
            </AdittionalItem>
          ))}
        </AdditionalsContainer>
        <TotalContainer>
          <Title>Total do pedido</Title>
          <PriceButtonContainer>
            <TotalPrice testID="cart-total">{cartTotal}</TotalPrice>
            <QuantityContainer>
              <Icon
                size={15}
                color="#6C6C80"
                name="minus"
                onPress={handleDecrementFood}
                testID="decrement-food"
              />
              <AdittionalItemText testID="food-quantity">
                {foodQuantity}
              </AdittionalItemText>
              <Icon
                size={15}
                color="#6C6C80"
                name="plus"
                onPress={handleIncrementFood}
                testID="increment-food"
              />
            </QuantityContainer>
          </PriceButtonContainer>

          <FinishOrderButton onPress={() => handleFinishOrder()}>
            <ButtonText>Confirmar pedido</ButtonText>
            <IconContainer>
              <Icon name="check-square" size={24} color="#fff" />
            </IconContainer>
          </FinishOrderButton>
        </TotalContainer>
      </ScrollContainer>
      <OverlayMessage
        isVisible={isMessageVisisble}
        icon="thumbs-up"
        iconColor="#39B100"
        message="Pedido confirmado!"
        onTimeout={onOverlayTimeout}
        onClose={onOverlayClose}
      />
    </Container>
  );
};

export default FoodDetails;

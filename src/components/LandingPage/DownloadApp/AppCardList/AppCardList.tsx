import { AppCard } from './AppCard/AppCard';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import GroupsIcon from '@mui/icons-material/Groups';
import ShareIcon from '@mui/icons-material/Share';
import PinDropIcon from '@mui/icons-material/PinDrop';
import { AppList } from './AppList.style';

export const AppCardList = () => {
  return (
    <AppList>
      <AppCard
        Icon={TravelExploreIcon}
        title="Descubra"
        text="diversas atrações incríveis esperando por você!"
        variant="light"
      />
      <AppCard
        Icon={GroupsIcon}
        title="Conecte"
        text="e obtenha informações sobre eventos, rotas e pontos turísticos."
        variant="lightNormal"
      />
      <AppCard
        Icon={ShareIcon}
        title="Divulgue"
        text="seu negócio e compartilhe experiências."
        variant="darkNormal"
      />
      <AppCard
        Icon={PinDropIcon}
        title="Conheça"
        text="e apaixone-se pela cidade de São Francisco de Paula"
        variant="dark"
      />
    </AppList>
  );
};

import Box from "@mui/material/Box";
import AppMockSVG from "../../../assets/Cellphone.svg";
import ShadowSVG from "../../../assets/Shadow.svg";
import { Stack, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import Cellphone from "../../../assets/Cellphone.png";
import Shadow from "../../../assets/Shadow.png";
import React from "react";
import {
  AppStoreButton,
  ButtonsContainer,
  GooglePlayButton,
} from "react-mobile-app-button";
import { DownloadAppButton } from "./DowloadAppButton/DownloadAppButton";
import GooglePlayIcon from "../../../assets/GooglePlayIcon.png";
import AppStoreIcon from "../../../assets/AppStoreIcon.png";
import { AppCard } from "./AppCard/AppCard";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import GroupsIcon from "@mui/icons-material/Groups";
import ShareIcon from "@mui/icons-material/Share";
import PinDropIcon from "@mui/icons-material/PinDrop";

export const DownloadApp = () => {
  const theme = useTheme();
  return (
    <Stack
      width={"100%"}
      height={"100rem"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={"4rem"}
    >
      <Box
        display={"flex"}
        width={"100%"}
        height={"40%"}
        justifyContent={"center"}
      >
        <Stack alignItems={"center"} width={"auto"} height={"95%"}>
          <Image
            src={Cellphone}
            alt="Foto exemplo"
            style={{ width: "100%", height: "100%" }}
          />
          <Box
            width={"100%"}
            height={"auto"}
            display={"flex"}
            justifyContent={"center"}
            marginLeft={"2rem"}
          >
            <Image
              src={Shadow}
              alt="Foto exemplo"
              style={{ width: "60%", height: "auto" }}
            />
          </Box>
        </Stack>
        <Stack
          gap={"1.5rem"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"28%"}
          height={"80%"}
        >
          <Typography variant="h1" color={theme.palette.primary[600]}>
            Baixe o App
          </Typography>
          <Stack
            width={"90%"}
            alignSelf={"flex-end"}
            height={"auto"}
            justifyContent={"flex-end"}
            gap={"1.5rem"}
          >
            <Typography
              variant="body2"
              color={theme.palette.neutrals.darkGrey}
              textAlign={"right"}
              sx={{ ineHeight: 0.1 }}
            >
              Não é um empreendedor ou deseja conhecer mais sobre nosso
              aplicativo e todas as opções de turismo rural em São Francisco de
              Paula?
            </Typography>
            <Typography
              variant="body2"
              color={theme.palette.neutrals.darkGrey}
              textAlign={"right"}
              sx={{ ineHeight: 1.2 }}
            >
              Baixe o app e surpreenda-se ao conhecer todos os diferentes
              eventos, serviços, rotas e pontos turísticos que esperam por você
              na cidade de São Chico!
            </Typography>
            <Box
              display={"flex"}
              width={"100%"}
              gap={"0.6rem"}
              justifyContent={"flex-end"}
            >
              <DownloadAppButton
                icon={GooglePlayIcon.src}
                title={"Google Play"}
                subtitle={"GET IT ON"}
                url={"aaaa"}
              />
              <DownloadAppButton
                icon={AppStoreIcon.src}
                title={"Apple Store"}
                subtitle={"Available on the"}
                url={"aaaa"}
              />
            </Box>
          </Stack>
        </Stack>
      </Box>
      <Box
        display={"flex"}
        width={"100%"}
        height={"30%"}
        justifyContent={"center"}
        alignContent={"center"}
        gap={"1.5rem"}
        padding={"2rem"}
      >
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
      </Box>
      <Stack width={"100%"} height={"auto"}>
        <Box
          display={"flex"}
          width={"100%"}
          height={"auto"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"0.5rem"}
        >
          <Typography
            variant="body2"
            color={theme.palette.primary[300]}
            fontWeight={700}
            sx={{ textDecoration: "underline" }}
          >
            Baixe o app
          </Typography>
          <Typography
            variant="body2"
            color={theme.palette.neutrals.darkGrey}
            textAlign={"center"}
            sx={{ lineHeight: 1.2 }}
          >
            para começar a descobir São Chico ou se for um empreendedor
          </Typography>
        </Box>
        <Typography variant="h2" fontWeight={600} color={theme.palette.neutrals.baseBlack}>Cadastre seu negócio pelo site</Typography>
      </Stack>
    </Stack>
  );
};

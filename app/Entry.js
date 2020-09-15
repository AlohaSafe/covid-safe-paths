/* eslint-disable react/display-name */
import React from 'react';
// import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';
import { NavigationContainer } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  TransitionPresets,
  createStackNavigator,
} from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';

import SettingsScreen from './views/Settings';
import AboutScreen from './views/About';

////// ALOHA SAFE STORY EDITS //////
// import PartnersOverviewScreen from './views/Partners/PartnersOverview';
// import PartnersEditScreen from './views/Partners/PartnersEdit';
// import PartnersCustomUrlScreen from './views/Partners/PartnersCustomUrlScreen';
////// ALOHA SAFE STORY EDITS //////

import { LicensesScreen } from './views/Licenses';
import { ExportStart, ExportLocally } from './gps/Export';

// import ExposureHistoryScreen from './views/ExposureHistory';
// import MoreInfo from './views/ExposureHistory/MoreInfo';
import ImportFromUrl from './views/Settings/ImportFromUrl';
import { FeatureFlagsScreen } from './views/FeatureFlagToggles';
import ImportScreen from './views/Import';
import Welcome from './views/onboarding/Welcome';
import PersonalPrivacy from './views/onboarding/PersonalPrivacy';
import NotificationDetails from './views/onboarding/NotificationDetails';
// import ShareDiagnosis from './views/onboarding/ShareDiagnosis';
// import NotificationsPermissions from './views/onboarding/NotificationsPermissions';
import LocationsPermissions from './views/onboarding/LocationsPermissions';
import LanguageSelection from './views/LanguageSelection';
import ReportIssueForm from './views/ReportIssueForm';

import { Screens, Stacks } from './navigation';

// import ExposureHistoryContext from './ExposureHistoryContext';
import isOnboardingCompleteSelector from './store/selectors/isOnboardingCompleteSelector';

////// ALOHA SAFE STORY EDITS //////
import getHealthcareAuthorities from './store/actions/healthcareAuthorities/getHealthcareAuthoritiesAction';
import toggleSandboxHealthcareAuthorityAction from './store/actions/healthcareAuthorities/toggleSandboxHealthcareAuthorityAction';
import isHdohSelectedSelector from './store/selectors/isHdohSelectedSelector';
import isAuthorityListLoadedSelector from './store/selectors/isAuthorityListLoadedSelector';
import autoSelectHdohAction from './store/actions/healthcareAuthorities/autoSelectHdohAction';
import { FeatureFlagOption } from './store/types';
////// ALOHA SAFE STORY EDITS //////

import { isPlatformAndroid } from './Util';
import { useTracingStrategyContext } from './TracingStrategyContext';

import * as Icons from './assets/svgs/TabBarNav';
import { Layout, Spacing, Colors } from './styles';
import ExportStack from './gps/ExportStack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const SCREEN_OPTIONS = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  cardStyle: {
    backgroundColor: 'transparent', // prevent white flash on Android
  },
  headerShown: false,
};

// const ExposureHistoryStack = ({ navigation }) => {
//   const { observeExposures } = useContext(ExposureHistoryContext);
//   useEffect(() => {
//     const unsubscribeTabPress = navigation.addListener('tabPress', () => {
//       observeExposures();
//     });
//     return unsubscribeTabPress;
//   }, [navigation, observeExposures]);

//   return (
//     <Stack.Navigator
//       mode='modal'
//       screenOptions={{
//         ...SCREEN_OPTIONS,
//       }}>
//       <Stack.Screen
//         name={Screens.ExposureHistory}
//         component={ExposureHistoryScreen}
//       />
//       <Stack.Screen name={Screens.MoreInfo} component={MoreInfo} />
//     </Stack.Navigator>
//   );
// };

const MoreTabStack = () => (
  <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
    <Stack.Screen name={Screens.Settings} component={SettingsScreen} />
    <Stack.Screen name={Screens.About} component={AboutScreen} />
    <Stack.Screen name={Screens.Licenses} component={LicensesScreen} />
    <Stack.Screen name={Screens.FeatureFlags} component={FeatureFlagsScreen} />
    <Stack.Screen name={Screens.ImportFromGoogle} component={ImportScreen} />
    <Stack.Screen name={Screens.ImportFromUrl} component={ImportFromUrl} />
    <Stack.Screen name={Screens.ExportLocally} component={ExportLocally} />
    <Stack.Screen name={Screens.ReportIssue} component={ReportIssueForm} />
  </Stack.Navigator>
);

const MainAppTabs = () => {
  const { t } = useTranslation();
  // const { userHasNewExposure } = useContext(ExposureHistoryContext);
  const { homeScreenComponent } = useTracingStrategyContext();

  // const applyBadge = (icon) => {
  //   return (
  //     <>
  //       {icon}
  //       <View style={styles.iconBadge} />
  //     </>
  //   );
  // };

  // const styles = StyleSheet.create({
  //   iconBadge: {
  //     ...Affordances.iconBadge,
  //   },
  // });

  return (
    <Tab.Navigator
      initialRouteName={Stacks.Main}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: Colors.white,
        inactiveTintColor: Colors.primaryViolet,
        style: {
          backgroundColor: Colors.navBar,
          borderTopColor: Colors.navBar,
          paddingTop: isPlatformAndroid() ? 0 : Spacing.xSmall,
          height: Layout.navBar,
        },
      }}>
      <Tab.Screen
        name={Stacks.Main}
        component={homeScreenComponent}
        options={{
          tabBarLabel: t('navigation.home'),
          tabBarIcon: ({ focused, size }) => (
            <SvgXml
              xml={focused ? Icons.HomeActive : Icons.HomeInactive}
              width={size}
              height={size}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name={Stacks.ExposureHistory}
        component={ExposureHistoryStack}
        options={{
          tabBarLabel: t('navigation.history'),
          tabBarIcon: ({ focused, size }) => {
            const tabIcon = (
              <SvgXml
                xml={focused ? Icons.CalendarActive : Icons.CalendarInactive}
                width={size}
                height={size}
              />
            );

            return userHasNewExposure ? applyBadge(tabIcon) : tabIcon;
          },
        }}
      /> */}
      <Tab.Screen
        name={Screens.ExportStart}
        component={ExportStart}
        options={{
          tabBarLabel: t('navigation.locations'),
          tabBarIcon: ({ focused, size }) => (
            <SvgXml
              xml={focused ? Icons.UploadActive : Icons.UploadInactive}
              width={size}
              height={size}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name={Stacks.Partners}
        component={PartnersStack}
        options={{
          tabBarLabel: t('navigation.partners'),
          tabBarIcon: ({ focused, size }) => (
            <SvgXml
              xml={focused ? Icons.ShieldActive : Icons.ShieldInactive}
              width={size}
              height={size}
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name={Stacks.More}
        component={MoreTabStack}
        options={{
          tabBarLabel: t('navigation.more'),
          tabBarIcon: ({ focused, size }) => (
            <SvgXml
              xml={focused ? Icons.MoreActive : Icons.MoreInactive}
              width={size}
              height={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const OnboardingStack = () => (
  <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
    <Stack.Screen name={Screens.Welcome} component={Welcome} />
    <Stack.Screen name={Screens.PersonalPrivacy} component={PersonalPrivacy} />
    <Stack.Screen
      name={Screens.NotificationDetails}
      component={NotificationDetails}
    />
    {/* <Stack.Screen name={Screens.ShareDiagnosis} component={ShareDiagnosis} /> */}
    {/* <Stack.Screen
      name={Screens.OnboardingNotificationPermissions}
      component={NotificationsPermissions}
    /> */}
    <Stack.Screen
      name={Screens.OnboardingLocationPermissions}
      component={LocationsPermissions}
    />
  </Stack.Navigator>
);
////// ALOHA SAFE STORY EDITS //////

// const PartnersStack = () => (
//   <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
//     <Stack.Screen
//       name={Screens.PartnersOverview}
//       component={PartnersOverviewScreen}
//     />
//     <Stack.Screen name={Screens.PartnersEdit} component={PartnersEditScreen} />
//     <Stack.Screen
//       name={Screens.PartnersCustomUrl}
//       component={PartnersCustomUrlScreen}
//     />
//   </Stack.Navigator>
// );

////// ALOHA SAFE STORY EDITS //////
export const Entry = () => {
  const onboardingComplete = useSelector(isOnboardingCompleteSelector);

  ////// ALOHA SAFE STORY EDITS //////
  const featureFlags = useSelector((state) => state.featureFlags?.flags || {});
  const sandboxHealthAuthority = !!featureFlags[FeatureFlagOption.SANDBOX_HA];
  const authorityListLoaded = useSelector(isAuthorityListLoadedSelector);
  const hdohSelected = useSelector(isHdohSelectedSelector);

  const dispatch = useDispatch();
  // Fetches and sets HAs from yaml on launch if it is not stored.
  // WARNING: No special error handling in case of failure in this section. Handled through the action/reducer
  if (!authorityListLoaded) {
    dispatch(getHealthcareAuthorities());
  }
  // Sets to Hawaii Dept. of Health
  if (!hdohSelected) {
    dispatch(autoSelectHdohAction());
  }
  
  if (sandboxHealthAuthority) {
    dispatch(toggleSandboxHealthcareAuthorityAction());
  } else {
    dispatch(autoSelectHdohAction());
  }
  ////// ALOHA SAFE STORY EDITS //////
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        {onboardingComplete ? (
          <Stack.Screen name={'App'} component={MainAppTabs} />
        ) : (
          <Stack.Screen name={Stacks.Onboarding} component={OnboardingStack} />
        )}
        {/* Modal Views: */}
        <Stack.Screen
          name={Screens.ExportFlow}
          component={ExportStack}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
        <Stack.Screen
          name={Screens.LanguageSelection}
          component={LanguageSelection}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

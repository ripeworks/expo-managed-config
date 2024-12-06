import { ExpoConfig } from "@expo/config";
import {
  AndroidConfig,
  withAndroidManifest,
  withStringsXml,
} from "@expo/config-plugins";
// @ts-ignore
import fs from "fs-extra";
import { resolve } from "path";

type AppRestriction = {
  key: string;
  title: string;
  type: "string";
  description: string;
  defaultValue: string;
};

function withAppRestrictions(
  config: ExpoConfig,
  restrictions: AppRestriction[]
): ExpoConfig {
  return withAndroidManifest(config, async (config) => {
    config.modResults = setAppManifest(config.modResults);
    await setAppRestrictionsFile(config.modRequest.projectRoot, restrictions);
    return config;
  });
}

function withAppStrings(
  config: ExpoConfig,
  restrictions: AppRestriction[]
): ExpoConfig {
  return withStringsXml(config, (config) => {
    config.modResults = AndroidConfig.Strings.setStringItem(
      restrictions
        .map((restriction) => [
          {
            $: { name: restriction.key, translatable: "false" },
            _: restriction.title,
          },
          {
            $: {
              name: `${restriction.key}_description`,
              translatable: "false",
            },
            _: restriction.description,
          },
        ])
        .flat(),
      config.modResults
    );
    return config;
  });
}

function setAppManifest(
  androidManifest: AndroidConfig.Manifest.AndroidManifest
): AndroidConfig.Manifest.AndroidManifest {
  const mainApplication =
    AndroidConfig.Manifest.getMainApplicationOrThrow(androidManifest);
  AndroidConfig.Manifest.addMetaDataItemToMainApplication(
    mainApplication,
    "android.content.APP_RESTRICTIONS",
    "@xml/app_restrictions",
    "resource"
  );

  return androidManifest;
}

async function setAppRestrictionsFile(
  projectRoot: string,
  restrictions: AppRestriction[]
) {
  const destinationPath = resolve(
    projectRoot,
    `android/app/src/main/res/xml/app_restrictions.xml`
  );

  try {
    await fs.outputFile(
      destinationPath,
      `<?xml version="1.0" encoding="utf-8"?>
<restrictions xmlns:android="http://schemas.android.com/apk/res/android">

  ${restrictions
    .map(
      (restriction) => `<restriction
  android:key="${restriction.key}"
  android:title="@string/${restriction.key}"
  android:restrictionType="string"
  android:description="@string/${restriction.key}_description"
  android:defaultValue="${restriction.defaultValue}" />`
    )
    .join("\n")}

</restrictions>`
    );
  } catch (e) {
    throw new Error(`Cannot write app_restrictions.xml`);
  }

  return true;
}

function withAppConfig(
  config: ExpoConfig,
  { restrictions }: { restrictions: AppRestriction[] }
): ExpoConfig {
  config = withAppStrings(config, restrictions);
  config = withAppRestrictions(config, restrictions);
  return config;
}

export default withAppConfig;

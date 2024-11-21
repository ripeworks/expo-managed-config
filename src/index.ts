import ExpoManagedConfigModule from "./ExpoManagedConfigModule";
export * from "./ManagedConfigProvider";

export function getManagedConfig() {
  return ExpoManagedConfigModule.getManagedConfig();
}

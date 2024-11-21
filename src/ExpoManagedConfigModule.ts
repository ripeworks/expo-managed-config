import { NativeModule, requireNativeModule } from "expo";

declare class ExpoManagedConfigModule extends NativeModule {
  getManagedConfig: () => Record<string, any>;
}

export default requireNativeModule<ExpoManagedConfigModule>(
  "ExpoManagedConfig"
);

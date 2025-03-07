#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PipModule, NSObject)
RCT_EXTERN_METHOD(EnterPipMode:(NSString *)videoUrl)
RCT_EXTERN_METHOD(cleanup)

// Add this line to make the module available in the main thread
+ (BOOL)requiresMainQueueSetup
{
    return YES;
}
@end
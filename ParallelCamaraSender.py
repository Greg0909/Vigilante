import multiprocessing 
import time 
import requests
import json
import numpy as np
import cv2

firstPass = True

def sendBytes(imageBytes, segment="seg1"):
    #print(imageBytes)
    #print("size:", len(imageBytes))
    #print("type:", type(imageBytes))
    #print("type of element", type(imageBytes[0]))
    stringImage = convertToString(imageBytes)


    obj = {
        "imageBytes":stringImage,
    }

    requests.put(url=f"https://vigilante-casa-default-rtdb.firebaseio.com/device1/cam1/{segment}.json", json= obj)
    #print("send wuw")
    return 1

def square(x): 
    return x * x 

def convertToString(imageBytes):
    return "".join(imageBytes)

def cropAndSend(params):
    gray_frame = params[0]
    size = np.shape(gray_frame)[0]

    if(params[1] == "seg1"):
        imageBytes = list(map(chr, gray_frame[0:size//4,:].flatten()))
    else:
        return
    # elif(params[1] == "seg2"):
    #     imageBytes = list(map(chr, gray_frame[size//4:2*size//4,:].flatten()))
    # elif(params[1] == "seg3"):
    #     imageBytes = list(map(chr, gray_frame[2*size//4:3*size//4,:].flatten()))
    # elif(params[1] == "seg4"):
    #     imageBytes = list(map(chr, gray_frame[3*size//4:,:].flatten()))
    
    return sendBytes( imageBytes, params[1] )


if __name__ == '__main__': 
    pool = multiprocessing.Pool() 
    # inputs = [0,1,2,3,4] 
    # outputs_async = pool.map_async(square, inputs)
    # outputs = outputs_async.get() 
    # print("Output: {}".format(outputs)) 





    cap = cv2.VideoCapture(0)
    count=0
    ret, prevFrame = cap.read()
    prevFrame=cv2.cvtColor(prevFrame, cv2.COLOR_BGR2GRAY)

    while(True):
        start = time.time()
        count+=1
        
        # Capture frame-by-frame
        ret, frame = cap.read()
        print("Read Camera:", time.time()-start, "s")
        helper = time.time()
        #print(frame.shape)
        
        # Our operations on the frame come here
        gray_frame=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
        print("Change Color:", time.time()-helper, "s")
        helper = time.time()
        
        percent = 0.4
        dim = (int(gray_frame.shape[1]*percent), int(gray_frame.shape[0]*percent))
        gray_frame=cv2.resize(gray_frame, dim, interpolation = cv2.INTER_AREA)
        #gray_frame=cv2.GaussianBlur(gray_frame,(25,25),0)
        print("Resize Image:", time.time()-helper, "s")
        helper = time.time()


        
        #---------------  START  Crop into Segments and Sends -------------------

        inputs = [ [gray_frame, "seg1"], [gray_frame, "seg2"], [gray_frame, "seg3"], [gray_frame, "seg4"] ]


        if(firstPass != True):
            outputs = outputs_async.get()


        outputs_async = pool.map_async(cropAndSend, inputs)
        # imageBytes = list(map(chr, gray_frame[0:24,:].flatten()))
        # print("1. Crop:", time.time()-helper, "s")
        # helper = time.time()
        
        # sendBytes( imageBytes, "seg1" )
        #sendBytes( [0,255,255,255] )
        # print("1. Send Image:", time.time()-helper, "s")
        # helper = time.time()

        # imageBytes = list(map(chr, gray_frame[24:48,:].flatten()))
        # print("2. Crop:", time.time()-helper, "s")
        # helper = time.time()
        
        # sendBytes( imageBytes, "seg2" )
        # print("2. Send Image:", time.time()-helper, "s")
        # helper = time.time()

        #---------------  END  Crop into Segments and Sends -------------------
        print("Crop and Send segments in parallel:", time.time()-helper, "s")
        helper = time.time()



        # Display the resulting frame
        # cv2.imshow('frame',gray_frame)
        # #count, prevFrame= checkForChange(count, gray_frame, prevFrame)
        # print("DisplayImage:", time.time()-helper, "s")
        # helper = time.time()
        
        end = time.time()
        #time.sleep( max(0,0.2 - (end-start)))
        print("Total Time:", time.time()-start, "s\n")
        
        firstPass = False

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # When everything done, release the capture
    cap.release()
    cv2.destroyAllWindows()
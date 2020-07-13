import Foundation

import XCTest
@testable import BT

class ExposureManagerTests: XCTestCase {
  
  let indexTxt = """
    mn/1593432000-1593446400-00001.zip
    mn/1593432000-1593446400-00002.zip
    mn/1593432000-1593446400-00003.zip
    mn/1593432000-1593446400-00004.zip
    mn/1593432000-1593446400-00005.zip
    mn/1593432000-1593446400-00006.zip
    mn/1593432000-1593446400-00007.zip
    mn/1593432000-1593446400-00008.zip
    mn/1593432000-1593446400-00009.zip
    mn/1593432000-1593446400-00010.zip
    mn/1593432000-1593446400-00011.zip
    mn/1593432000-1593446400-00012.zip
    mn/1593432000-1593446400-00013.zip
    mn/1593432000-1593446400-00014.zip
    mn/1593432000-1593446400-00015.zip
    mn/1593432000-1593446400-00016.zip
    mn/1593432000-1593446400-00017.zip
    mn/1593432000-1593446400-00018.zip
    mn/1593432000-1593446400-00019.zip
    mn/1593432000-1593446400-00020.zip
    mn/1593432000-1593446400-00021.zip
    mn/1593432000-1593446400-00022.zip
    mn/1593432000-1593446400-00023.zip
    mn/1593446400-1593460800-00001.zip
    mn/1593446400-1593460800-00002.zip
    mn/1593446400-1593460800-00003.zip
    mn/1593446400-1593460800-00004.zip
    mn/1593446400-1593460800-00005.zip
    mn/1593446400-1593460800-00006.zip
    mn/1593446400-1593460800-00007.zip
    mn/1593446400-1593460800-00008.zip
    mn/1593446400-1593460800-00009.zip
    mn/1593446400-1593460800-00010.zip
    mn/1593446400-1593460800-00011.zip
    mn/1593446400-1593460800-00012.zip
    mn/1593446400-1593460800-00013.zip
    mn/1593446400-1593460800-00014.zip
    mn/1593446400-1593460800-00015.zip
    mn/1593446400-1593460800-00016.zip
    mn/1593446400-1593460800-00017.zip
    mn/1593446400-1593460800-00018.zip
    mn/1593446400-1593460800-00019.zip
    mn/1593446400-1593460800-00020.zip
    mn/1593446400-1593460800-00021.zip
    mn/1593446400-1593460800-00022.zip
    mn/1593446400-1593460800-00023.zip
    mn/1593460800-1593475200-00001.zip
    mn/1593460800-1593475200-00002.zip
    mn/1593460800-1593475200-00003.zip
    mn/1593460800-1593475200-00004.zip
    mn/1593460800-1593475200-00005.zip
    mn/1593460800-1593475200-00006.zip
    mn/1593460800-1593475200-00007.zip
    mn/1593460800-1593475200-00008.zip
    mn/1593460800-1593475200-00009.zip
    mn/1593460800-1593475200-00010.zip
    mn/1593460800-1593475200-00011.zip
    mn/1593460800-1593475200-00012.zip
    mn/1593460800-1593475200-00013.zip
    mn/1593460800-1593475200-00014.zip
    mn/1593460800-1593475200-00015.zip
    mn/1593460800-1593475200-00016.zip
    mn/1593460800-1593475200-00017.zip
    mn/1593460800-1593475200-00018.zip
    mn/1593460800-1593475200-00019.zip
    mn/1593460800-1593475200-00020.zip
    mn/1593460800-1593475200-00021.zip
    mn/1593460800-1593475200-00022.zip
"""
  
  func urlPathsToProcessFirstPass() {
    let paths = ExposureManager.shared.urlPathsToProcess(indexTxt.gaenFilePaths)
    XCTAssertEqual(paths.first!, "mn/1593432000-1593446400-00001.zip")
    XCTAssertEqual(paths.last!, "mn/1593432000-1593446400-00015.zip")
  }
  
  func urlPathsToProcessSecondPass() {
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593432000-1593446400-00015.zip"
    let paths = ExposureManager.shared.urlPathsToProcess(indexTxt.gaenFilePaths)
    XCTAssertEqual(paths.first!, "mn/1593432000-1593446400-00016.zip")
    XCTAssertEqual(paths.last!, "mn/1593446400-1593460800-00007.zip")
  }
  
  func urlPathsToProcessAfterReadingAllFiles() {
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00022.zip"
    let paths = ExposureManager.shared.urlPathsToProcess(indexTxt.gaenFilePaths)
    XCTAssertEqual(paths.count, 0)
  }
  
  func updateRemainingFileCapacityFirstPass() {
    ExposureManager.shared.updateRemainingFileCapacity()
    let hoursSinceLastReset = Date.hourDifference(from: BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset, to: Date())
    XCTAssertEqual(hoursSinceLastReset, 0)
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }
  
  func updateRemainingFileCapacityUnder24Hours() {
    BTSecureStorage.shared.dateLastPerformedFileCapacityReset = Date()
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = 2
    ExposureManager.shared.updateRemainingFileCapacity()
    let hoursSinceLastReset = Date.hourDifference(from: BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset, to: Date())
    XCTAssertEqual(hoursSinceLastReset, 0)
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, 2)
  }
  
  func updateRemainingFileCapacityAfter24Hours() {
    let twoDaysAgo = Calendar.current.date(byAdding: .day, value: -2, to: Date())!
    BTSecureStorage.shared.dateLastPerformedFileCapacityReset = twoDaysAgo
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = 2
    ExposureManager.shared.updateRemainingFileCapacity()
    let hoursSinceLastReset = Date.hourDifference(from: BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset, to: Date())
    XCTAssertEqual(hoursSinceLastReset, 0)
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }
  
}



import Foundation
import ZIPFoundation
import CryptoKit

struct DownloadedPackage {
  // MARK: Creating a Key Package

  init(keysBin: Data, signature: Data) {
    bin = keysBin
    self.signature = signature
  }

  init?(compressedData: Data) {
    guard let archive = Archive(data: compressedData, accessMode: .read) else {
      return nil
    }
    do {
      self = try archive.extractKeyPackage()
    } catch {
      return nil
    }
  }

  // MARK: Properties

  let bin: Data
  let signature: Data

  // MARK: - Verification

  typealias Verification = (DownloadedPackage) -> Bool
  struct Verifier {
    private let keyProvider: PublicKeyProviding

    init(key provider: @escaping PublicKeyProviding = PublicKeyStore.get) {
      self.keyProvider = provider
    }

    func verify(_ package: DownloadedPackage) -> Bool {
      guard
        let bundleId = Bundle.main.bundleIdentifier
        else {
          return false
      }

        let signatureData: Data = package.signature
        guard
          let publicKey = try? keyProvider(bundleId),
          let signature = try? P256.Signing.ECDSASignature(derRepresentation: signatureData)
          else {
            return false
        }

        if publicKey.isValidSignature(signature, for: package.bin) {
          return true
        }

      return false
    }

    func callAsFunction(_ package: DownloadedPackage) -> Bool {
      verify(package)
    }
  }
}

private extension Archive {
  typealias KeyPackage = (bin: Data, sig: Data)
  enum KeyPackageError: Error {
    case binNotFound
    case sigNotFound
    case signatureCheckFailed
  }

  func extractData(from entry: Entry) throws -> Data {
    var data = Data()
    try _ = extract(entry) { slice in
      data.append(slice)
    }
    return data
  }

  func extractKeyPackage() throws -> DownloadedPackage {
    guard let binEntry = self["export.bin"] else {
      throw KeyPackageError.binNotFound
    }
    guard let sigEntry = self["export.sig"] else {
      throw KeyPackageError.sigNotFound
    }
    return DownloadedPackage(
      keysBin: try extractData(from: binEntry),
      signature: try extractData(from: sigEntry)
    )
  }
}

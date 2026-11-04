# ===================================================
# Berkas : latihan2_suhu.py
# Latihan Mandiri 2: Kalkulator Konversi Suhu Interaktif
# Nama   : Farid Rizky Fauzan
# NIM    : 124140210
# ===================================================

# Input temperatur dalam derajat Celcius (di-casting ke float)
celcius = float(input("Masukkan suhu dalam derajat Celcius: "))

# Rumus konversi
fahrenheit = celcius * 9 / 5 + 32
kelvin = celcius + 273.15

# Tampilkan hasil dengan f-string rapi, 2 angka di belakang koma
print("\n========= HASIL KONVERSI SUHU =========")
print(f"Celcius    : {celcius:.2f} C")
print(f"Fahrenheit : {fahrenheit:.2f} F")
print(f"Kelvin     : {kelvin:.2f} K")
print("=======================================")
